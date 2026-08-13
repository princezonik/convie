<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InternalAuthController extends Controller
{
    public function validateToken(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}