<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalService
{
    public function handle(Request $request, Closure $next): Response
    {
        $serviceKey = $request->header('X-Service-Key');

        if (
            !$serviceKey ||
            !hash_equals((string) config('services.internal_service_key'), $serviceKey)
        ) {
            return response()->json([
                'message' => 'Unauthorized service.',
            ], 401);
        }

        return $next($request); 
    }
}