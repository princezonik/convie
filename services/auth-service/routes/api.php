<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InternalAuthController;

Route::prefix('auth')->group(function () {
    // Brute-force protection: per IP, per minute
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });


});


Route::middleware(['internal.service', 'auth:sanctum',])->group(function () {
    
Route::get('/internal/auth/validate', [
        InternalAuthController::class,
        'validateToken',
    ]);
});


