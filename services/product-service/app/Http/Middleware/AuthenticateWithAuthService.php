<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

/**
 * Validates the caller's bearer token against auth-service and exposes the
 * authenticated user on the request as `authenticated_user` (id, name, email)
 * and `authenticated_user_id`.
 */
class AuthenticateWithAuthService
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $response = Http::timeout(config('services.auth_service_timeout', 3))
                ->acceptJson()
                ->withToken($token)
                ->withHeaders([
                    'X-Service-Key' => (string) config('services.internal_service_key'),
                ])
                ->get(rtrim(config('services.auth_service_url'), '/').'/api/internal/auth/validate');
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'Authentication service unavailable.'], 503);
        }

        if ($response->status() === 401 && $response->json('message') === 'Unauthorized service.') {
            // Our X-Service-Key was rejected: a config problem, not the caller's fault.
            logger()->error('auth-service rejected INTERNAL_SERVICE_KEY from product-service.');

            return response()->json(['message' => 'Authentication service error.'], 503);
        }

        if ($response->status() === 401) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! $response->successful()) {
            return response()->json(['message' => 'Authentication service error.'], 503);
        }

        $user = $response->json('user');

        if (! is_array($user) || ! isset($user['id'])) {
            return response()->json(['message' => 'Invalid authentication response.'], 503);
        }

        $request->attributes->set('authenticated_user', $user);
        $request->attributes->set('authenticated_user_id', (int) $user['id']);

        return $next($request);
    }
}
