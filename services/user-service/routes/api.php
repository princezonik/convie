<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.service')->group(function () {
    Route::get('/users/me', [UserController::class, 'me']);
});

Route::get('/users/test', function () {
    return response()->json([
        'service' => 'user-service',
        'status' => 'ok',
    ]);
});
