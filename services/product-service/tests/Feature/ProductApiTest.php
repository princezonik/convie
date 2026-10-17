<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    private const VALIDATE_URL = 'http://auth.test/api/internal/auth/validate';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.auth_service_url' => 'http://auth.test',
            'services.internal_service_key' => 'test-key',
        ]);
    }

    /** Fake auth-service: token "token-{id}" is valid for user {id}. */
    private function fakeAuthService(): void
    {
        Http::fake(function (ClientRequest $request) {
            if ($request->header('X-Service-Key')[0] ?? null) {
                if ($request->header('X-Service-Key')[0] !== 'test-key') {
                    return Http::response(['message' => 'Unauthorized service.'], 401);
                }
            }

            $auth = $request->header('Authorization')[0] ?? '';

            if (preg_match('/^Bearer token-(\d+)$/', $auth, $m)) {
                return Http::response([
                    'authenticated' => true,
                    'user' => ['id' => (int) $m[1], 'name' => 'User '.$m[1], 'email' => "u{$m[1]}@example.com"],
                ]);
            }

            return Http::response(['message' => 'Unauthenticated.'], 401);
        });
    }

    private function asUser(int $id): static
    {
        return $this->withToken("token-{$id}");
    }

    public function test_index_is_public_and_only_lists_active_products(): void
    {
        Product::factory()->count(2)->create();
        Product::factory()->inactive()->create();

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('total', 2)
            ->assertJsonCount(2, 'data');
    }

    public function test_index_search_price_filter_and_sort(): void
    {
        Product::factory()->create(['name' => 'Ankara Shirt', 'price' => 5000]);
        Product::factory()->create(['name' => 'Ankara Dress', 'price' => 15000]);
        Product::factory()->create(['name' => 'Laptop Bag', 'price' => 9000]);

        $this->getJson('/api/products?q=ankara&sort=price_desc')
            ->assertOk()
            ->assertJsonPath('total', 2)
            ->assertJsonPath('data.0.name', 'Ankara Dress');

        $this->getJson('/api/products?min_price=6000&max_price=10000')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('data.0.name', 'Laptop Bag');
    }

    public function test_show_hides_inactive_products(): void
    {
        $active = Product::factory()->create();
        $inactive = Product::factory()->inactive()->create();

        $this->getJson("/api/products/{$active->id}")->assertOk()->assertJsonPath('data.id', $active->id);
        $this->getJson("/api/products/{$inactive->id}")->assertNotFound();
        $this->getJson('/api/products/999999')->assertNotFound();
    }

    public function test_create_requires_a_token(): void
    {
        $this->fakeAuthService();

        $this->postJson('/api/products', ['name' => 'X', 'price' => 10])->assertUnauthorized();
        $this->withToken('bogus')->postJson('/api/products', ['name' => 'X', 'price' => 10])->assertUnauthorized();

        Http::assertSentCount(1); // no token => no call to auth-service
    }

    public function test_authenticated_user_can_create_product_owned_by_them(): void
    {
        $this->fakeAuthService();

        $this->asUser(7)->postJson('/api/products', [
            'name' => 'Shea Butter 500g',
            'price' => 2500.5,
            'stock' => 10,
            'user_id' => 99, // must be ignored
        ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', 7)
            ->assertJsonPath('data.slug', 'shea-butter-500g')
            ->assertJsonPath('data.price', '2500.50')
            ->assertJsonPath('data.currency', 'NGN');

        Http::assertSent(fn (ClientRequest $r) => $r->url() === self::VALIDATE_URL
            && $r->hasHeader('X-Service-Key', 'test-key')
            && $r->hasHeader('Authorization', 'Bearer token-7'));
    }

    public function test_create_validates_input(): void
    {
        $this->fakeAuthService();

        $this->asUser(1)->postJson('/api/products', ['price' => -1, 'stock' => 'lots'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'price', 'stock']);
    }

    public function test_duplicate_names_get_unique_slugs(): void
    {
        $this->fakeAuthService();

        $a = $this->asUser(1)->postJson('/api/products', ['name' => 'Same Name', 'price' => 1])->json('data.slug');
        $b = $this->asUser(1)->postJson('/api/products', ['name' => 'Same Name', 'price' => 1])->json('data.slug');

        $this->assertSame('same-name', $a);
        $this->assertNotSame($a, $b);
    }

    public function test_only_owner_can_update_or_delete(): void
    {
        $this->fakeAuthService();
        $product = Product::factory()->create(['user_id' => 1, 'price' => 100]);

        $this->asUser(2)->patchJson("/api/products/{$product->id}", ['price' => 1])->assertForbidden();
        $this->asUser(2)->deleteJson("/api/products/{$product->id}")->assertForbidden();

        $this->asUser(1)->patchJson("/api/products/{$product->id}", ['price' => 150, 'is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.price', '150.00')
            ->assertJsonPath('data.is_active', false);

        $this->asUser(1)->deleteJson("/api/products/{$product->id}")->assertOk();
        $this->assertSoftDeleted($product);
        $this->getJson("/api/products/{$product->id}")->assertNotFound();
    }

    public function test_mine_lists_own_products_including_inactive(): void
    {
        $this->fakeAuthService();
        Product::factory()->count(2)->create(['user_id' => 5]);
        Product::factory()->inactive()->create(['user_id' => 5]);
        Product::factory()->create(['user_id' => 6]);

        $this->asUser(5)->getJson('/api/products/mine')->assertOk()->assertJsonPath('total', 3);
        $this->withoutToken()->getJson('/api/products/mine')->assertUnauthorized();
    }

    public function test_auth_service_down_returns_503(): void
    {
        Http::fake(fn () => throw new ConnectionException('down'));

        $this->asUser(1)->postJson('/api/products', ['name' => 'X', 'price' => 1])->assertStatus(503);
    }

    public function test_rejected_service_key_is_a_503_not_a_401(): void
    {
        $this->fakeAuthService();
        config(['services.internal_service_key' => 'wrong-key']);

        $this->asUser(1)->postJson('/api/products', ['name' => 'X', 'price' => 1])->assertStatus(503);
    }
}
