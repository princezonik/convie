<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.internal_service_key' => 'test-key']);
    }

    private function registerAndLogin(): string
    {
        $this->postJson('/api/auth/register', [
            'name' => 'Ada',
            'email' => 'ada@example.com',
            'password' => 'secret-pass',
            'password_confirmation' => 'secret-pass',
        ])->assertCreated()->assertJsonMissingPath('user.password');

        return $this->postJson('/api/auth/login', [
            'email' => 'ada@example.com',
            'password' => 'secret-pass',
        ])->assertOk()->json('token');
    }

    public function test_register_login_me_and_logout(): void
    {
        $token = $this->registerAndLogin();

        $this->withToken($token)->getJson('/api/auth/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'ada@example.com');

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/auth/user')->assertUnauthorized();
    }

    public function test_wrong_password_is_rejected(): void
    {
        User::factory()->create(['email' => 'ada@example.com']);

        $this->postJson('/api/auth/login', ['email' => 'ada@example.com', 'password' => 'nope'])
            ->assertUnauthorized();
    }

    public function test_login_is_rate_limited(): void
    {
        foreach (range(1, 5) as $i) {
            $this->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'nope'])
                ->assertUnauthorized();
        }

        $this->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'nope'])
            ->assertStatus(429);
    }

    public function test_internal_validate_requires_service_key_and_valid_token(): void
    {
        $token = $this->registerAndLogin();

        $this->withToken($token)->getJson('/api/internal/auth/validate')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthorized service.');

        $this->withToken($token)
            ->withHeader('X-Service-Key', 'wrong')
            ->getJson('/api/internal/auth/validate')
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();
        $this->withToken('garbage')
            ->withHeader('X-Service-Key', 'test-key')
            ->getJson('/api/internal/auth/validate')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');

        $this->withToken($token)
            ->withHeader('X-Service-Key', 'test-key')
            ->getJson('/api/internal/auth/validate')
            ->assertOk()
            ->assertJsonPath('authenticated', true)
            ->assertJsonPath('user.email', 'ada@example.com');
    }

    public function test_tokens_expire_when_configured(): void
    {
        config(['sanctum.expiration' => 60]);
        $token = $this->registerAndLogin();

        $this->travel(61)->minutes();

        $this->withToken($token)->getJson('/api/auth/user')->assertUnauthorized();
    }
}
