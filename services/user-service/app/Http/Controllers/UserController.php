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

        $profile = UserProfile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'User profile not found.',
            ], 404);
        }

        return response()->json([
            'id' => $profile->user_id,
            'phone' => $profile->phone,
            'avatar' => $profile->avatar,
            'bio' => $profile->bio,
        ]);
    }
}
