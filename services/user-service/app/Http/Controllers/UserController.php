<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserProfile;

class UserController extends Controller
{
     public function me(Request $request)
    {
        $userId = $request->attributes->get('authenticated_user_id');

        if (!$userId) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Profiles are created lazily: auth-service owns registration and
        // doesn't notify this service, so a new user has no row yet.
        $profile = UserProfile::firstOrCreate(['user_id' => $userId]);

        return response()->json([
            'id' => $profile->user_id,
            'phone' => $profile->phone,
            'avatar' => $profile->avatar,
            'bio' => $profile->bio,
        ]);
    }
}
