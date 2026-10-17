<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products/health', fn () => response()->json([
    'service' => 'product-service',
    'status' => 'ok',
]));

Route::middleware('auth.service')->group(function () {
    Route::get('/products/mine', [ProductController::class, 'mine']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update'])->whereNumber('product');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->whereNumber('product');
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show'])->whereNumber('product');
