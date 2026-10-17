<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products/health', function () {
    return response()->json([
        'service' => 'product-service',
        'status' => 'ok',
    ]);
});

Route::middleware('auth.service')->group(function () {
    Route::apiResource('products', ProductController::class)
        ->whereNumber('product');
});
