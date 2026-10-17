<?php

namespace Tests\Feature;

use App\Models\UserProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class UserMeTest extends TestCase
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

    public function test_requires_a_token(): void
    {
        Http::fake();

        $this->getJson('/api/users/me')->assertUnauthorized();
        Http::assertNothingSent();
    }

    public function test_new_user_gets_an_empty_profile_instead_of_404(): void
    {
        Http::fake(['auth.test/*' => Http::response(['authenticated' => true, 'user' => ['id' => 42]])]);

        $this->withToken('t')->getJson('/api/users/me')
            ->assertOk()
            ->assertJsonPath('id', 42)
            ->assertJsonPath('bio', null);

        $this->assertDatabaseHas('user_profiles', ['user_id' => 42]);
    }

    public function test_existing_profile_is_returned(): void
    {
        UserProfile::create(['user_id' => 7, 'bio' => 'hello']);
        Http::fake(['auth.test/*' => Http::response(['authenticated' => true, 'user' => ['id' => 7]])]);

        $this->withToken('t')->getJson('/api/users/me')->assertOk()->assertJsonPath('bio', 'hello');
    }

    public function test_invalid_token_is_401_but_bad_service_key_is_503(): void
    {
        Http::fake(['auth.test/*' => Http::sequence()
            ->push(['message' => 'Unauthenticated.'], 401)
            ->push(['message' => 'Unauthorized service.'], 401)]);

        $this->withToken('t')->getJson('/api/users/me')->assertUnauthorized();
        $this->withToken('t')->getJson('/api/users/me')->assertStatus(503);
    }

    public function test_auth_service_down_is_503(): void
    {
        Http::fake(fn () => throw new ConnectionException('down'));

        $this->withToken('t')->getJson('/api/users/me')->assertStatus(503);
    }
}
