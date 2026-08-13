<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InternalAuthController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

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
