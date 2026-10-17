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
     * GET /api/products — public, paginated list of active products.
     * Query: q (search name), min_price, max_price, sort (newest|price_asc|price_desc), per_page (max 100)
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:newest,price_asc,price_desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Product::active();

        $this->applyFilters($query, $validated);

        return response()->json(
            $query->paginate($validated['per_page'] ?? 20)->withQueryString()
        );
    }

    /**
     * GET /api/products/mine — the authenticated user's products, including inactive ones.
     */
    public function mine(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $products = Product::where('user_id', $this->userId($request))
            ->latest()
            ->paginate($validated['per_page'] ?? 20)
            ->withQueryString();

        return response()->json($products);
    }

    /**
     * GET /api/products/{product} — public; inactive products are hidden.
     */
    public function show(Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        return response()->json(['data' => $product]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'user_id' => $this->userId($request),
        ]);

        return response()->json([
            'message' => 'Product created.',
            'data' => $product->refresh(),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorizeOwner($request, $product);

        $product->update($request->validated());

        return response()->json([
            'message' => 'Product updated.',
            'data' => $product->refresh(),
        ]);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->authorizeOwner($request, $product);

        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['q'])) {
            $term = '%'.addcslashes($filters['q'], '%_\\').'%';
            $query->where('name', 'like', $term);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        match ($filters['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('price')->orderBy('id'),
            'price_desc' => $query->orderByDesc('price')->orderBy('id'),
            default => $query->latest()->orderByDesc('id'),
        };
    }

    private function userId(Request $request): int
    {
        $id = $request->attributes->get('authenticated_user_id');

        abort_unless($id, 401, 'Unauthenticated.');

        return (int) $id;
    }

    private function authorizeOwner(Request $request, Product $product): void
    {
        abort_unless($product->isOwnedBy($this->userId($request)), 403, 'You do not own this product.');
    }
}
