<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.auth_service_url' => 'http://auth.test',
            'services.internal_service_key' => 'test-key',
        ]);
    }

    /**
     * Fake auth-service so the given token resolves to the given user ID.
     */
    private function actingAsAuthUser(int $userId): array
    {
        Http::fake([
            'auth.test/api/internal/auth/validate' => Http::response([
                'authenticated' => true,
                'user' => ['id' => $userId, 'name' => 'Test', 'email' => 't@example.com'],
            ]),
        ]);

        return ['Authorization' => 'Bearer valid-token', 'Accept' => 'application/json'];
    }

    private function makeProduct(array $attributes = []): Product
    {
        return Product::create([
            'user_id' => 1,
            'name' => 'Ankara fabric',
            'price' => 4500,
            'stock' => 10,
            ...$attributes,
        ]);
    }

    public function test_health_route_is_public(): void
    {
        $this->getJson('/api/products/health')
            ->assertOk()
            ->assertJson(['service' => 'product-service', 'status' => 'ok']);
    }

    public function test_requests_without_a_token_are_rejected(): void
    {
        Http::fake();

        $this->getJson('/api/products')->assertUnauthorized();

        Http::assertNothingSent();
    }

    public function test_invalid_tokens_are_rejected(): void
    {
        Http::fake(['auth.test/*' => Http::response(['message' => 'Unauthenticated.'], 401)]);

        $this->getJson('/api/products', ['Authorization' => 'Bearer bad'])
            ->assertUnauthorized();
    }

    public function test_auth_service_outage_returns_503(): void
    {
        Http::fake(['auth.test/*' => Http::response(null, 500)]);

        $this->getJson('/api/products', ['Authorization' => 'Bearer x'])
            ->assertStatus(503);
    }

    public function test_middleware_forwards_token_and_service_key(): void
    {
        $headers = $this->actingAsAuthUser(1);

        $this->getJson('/api/products', $headers)->assertOk();

        Http::assertSent(fn ($request) => $request->hasHeader('X-Service-Key', 'test-key')
            && $request->hasHeader('Authorization', 'Bearer valid-token'));
    }

    public function test_user_can_create_a_product(): void
    {
        $headers = $this->actingAsAuthUser(7);

        $this->postJson('/api/products', [
            'name' => 'Shea butter',
            'description' => 'Raw, unrefined',
            'price' => 2500.5,
            'stock' => 3,
        ], $headers)
            ->assertCreated()
            ->assertJson([
                'user_id' => 7,
                'name' => 'Shea butter',
                'price' => '2500.50',
                'stock' => 3,
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('products', ['name' => 'Shea butter', 'user_id' => 7]);
    }

    public function test_user_id_cannot_be_spoofed_on_create(): void
    {
        $headers = $this->actingAsAuthUser(7);

        $this->postJson('/api/products', [
            'name' => 'Shea butter',
            'price' => 100,
            'user_id' => 99,
        ], $headers)->assertCreated()->assertJson(['user_id' => 7]);
    }

    public function test_create_validates_input(): void
    {
        $headers = $this->actingAsAuthUser(7);

        $this->postJson('/api/products', ['price' => -1, 'stock' => 'lots'], $headers)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'price', 'stock']);
    }

    public function test_index_lists_only_active_products(): void
    {
        $headers = $this->actingAsAuthUser(1);
        $this->makeProduct(['name' => 'Visible']);
        $this->makeProduct(['name' => 'Hidden', 'is_active' => false]);

        $this->getJson('/api/products', $headers)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Visible');
    }

    public function test_index_mine_lists_own_products_including_inactive(): void
    {
        $headers = $this->actingAsAuthUser(1);
        $this->makeProduct(['name' => 'Mine active']);
        $this->makeProduct(['name' => 'Mine hidden', 'is_active' => false]);
        $this->makeProduct(['name' => 'Someone else', 'user_id' => 2]);

        $this->getJson('/api/products?mine=1', $headers)
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_show_returns_a_product(): void
    {
        $headers = $this->actingAsAuthUser(2);
        $product = $this->makeProduct();

        $this->getJson("/api/products/{$product->id}", $headers)
            ->assertOk()
            ->assertJsonPath('name', 'Ankara fabric');
    }

    public function test_inactive_product_is_hidden_from_non_owners(): void
    {
        $product = $this->makeProduct(['is_active' => false]);

        $this->getJson("/api/products/{$product->id}", $this->actingAsAuthUser(2))
            ->assertNotFound();
    }

    public function test_inactive_product_is_visible_to_its_owner(): void
    {
        $product = $this->makeProduct(['is_active' => false]);

        $this->getJson("/api/products/{$product->id}", $this->actingAsAuthUser(1))
            ->assertOk();
    }

    public function test_missing_product_returns_404(): void
    {
        $this->getJson('/api/products/999', $this->actingAsAuthUser(1))
            ->assertNotFound();
    }

    public function test_owner_can_update_product(): void
    {
        $product = $this->makeProduct();

        $this->patchJson("/api/products/{$product->id}", ['price' => 5000, 'stock' => 0], $this->actingAsAuthUser(1))
            ->assertOk()
            ->assertJson(['price' => '5000.00', 'stock' => 0]);
    }

    public function test_non_owner_cannot_update_product(): void
    {
        $product = $this->makeProduct();

        $this->patchJson("/api/products/{$product->id}", ['price' => 1], $this->actingAsAuthUser(2))
            ->assertForbidden();

        $this->assertSame('4500.00', $product->fresh()->price);
    }

    public function test_owner_can_delete_product(): void
    {
        $product = $this->makeProduct();

        $this->deleteJson("/api/products/{$product->id}", [], $this->actingAsAuthUser(1))
            ->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_non_owner_cannot_delete_product(): void
    {
        $product = $this->makeProduct();

        $this->deleteJson("/api/products/{$product->id}", [], $this->actingAsAuthUser(2))
            ->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
