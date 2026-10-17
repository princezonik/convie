<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * List active products. Pass ?mine=1 to list the caller's own
     * products instead (including inactive ones).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $this->userId($request);

        $query = $request->boolean('mine')
            ? Product::where('user_id', $userId)
            : Product::active();

        $perPage = min(max($request->integer('per_page', 15), 1), 100);

        return response()->json(
            $query->latest()->paginate($perPage)
        );
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'user_id' => $this->userId($request),
        ]);

        return response()->json($product->refresh(), 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        // Inactive products are only visible to their owner.
        if (! $product->is_active && ! $product->isOwnedBy($this->userId($request))) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json($product);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        if (! $product->isOwnedBy($this->userId($request))) {
            return $this->forbidden();
        }

        $product->update($request->validated());

        return response()->json($product);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        if (! $product->isOwnedBy($this->userId($request))) {
            return $this->forbidden();
        }

        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * The user ID set by the auth.service middleware.
     */
    private function userId(Request $request): int
    {
        return (int) $request->attributes->get('authenticated_user_id');
    }

    private function forbidden(): JsonResponse
    {
        return response()->json([
            'message' => 'You do not own this product.',
        ], 403);
    }
}
