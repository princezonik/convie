<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithAuthService
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        try {
            $response = Http::timeout(config('services.auth_service_timeout', 3))->withHeaders([
                'X-Service-Key' => config('services.internal_service_key'),
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->get(
                config('services.auth_service_url') . '/api/internal/auth/validate'
            );
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Authentication service unavailable.',
            ], 503);
        }

        if ($response->status() === 401 && $response->json('message') === 'Unauthorized service.') {
            // Our X-Service-Key was rejected: a config problem, not the caller's fault.
            logger()->error('auth-service rejected INTERNAL_SERVICE_KEY from user-service.');

            return response()->json([
                'message' => 'Authentication service error.',
            ], 503);
        }

        if ($response->status() === 401) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Authentication service error.',
            ], 503);
        }

        $user = $response->json('user');

        if (!$user || !isset($user['id'])) {
            return response()->json([
                'message' => 'Invalid authentication response.',
            ], 503);
        }

        $request->attributes->set(
            'authenticated_user_id',
            $user['id']
        );

        return $next($request);
    }
}
