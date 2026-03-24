/**
 * productService — maps 1:1 to ProductController (/api/products)
 *
 * Mock flag: set VITE_USE_MOCK=true in .env to return mock data
 * without hitting the backend.
 */
import { api } from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  Product,
  PaginatedProduct,
  SearchProduct,
  CreateProductRequest,
  CreateProductResponse,
  PartialProductUpdateRequest,
  PriceUpdateRequest,
  UpdateProductCategoryRequest,
} from '../types/product';
import { MOCK_PRODUCTS, MOCK_PAGINATED_PRODUCTS } from './mocks/productMocks';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** GET /api/products?page=0&size=5 */
export async function getProducts(
  page = 0,
  size = 12,
): Promise<ApiResponse<PageResponse<PaginatedProduct>>> {
  if (USE_MOCK) return MOCK_PAGINATED_PRODUCTS(page, size);
  const res = await api.get<ApiResponse<PageResponse<PaginatedProduct>>>('/products', {
    params: { page, size },
  });
  return res.data;
}

/** GET /api/products/{id} */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  if (USE_MOCK) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return { status: 200, message: 'OK', data: product as Product, metadata: null };
  }
  const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return res.data;
}

/** GET /api/products/search?searchQuery=&inStock=&page=&limit=&sort= */
export async function searchProducts(
  searchQuery: string,
  inStock: boolean,
  page: number,
  limit: number,
  sort: string,
): Promise<ApiResponse<PageResponse<SearchProduct>>> {
  const res = await api.get<ApiResponse<PageResponse<SearchProduct>>>('/products/search', {
    params: { searchQuery, inStock, page, limit, sort },
  });
  return res.data;
}

/** GET /api/products/suggest?q= */
export async function suggestProducts(q: string): Promise<string[]> {
  const res = await api.get<string[]>('/products/suggest', { params: { q } });
  return res.data;
}

/** POST /api/products */
export async function createProduct(
  request: CreateProductRequest,
): Promise<ApiResponse<CreateProductResponse>> {
  const res = await api.post<ApiResponse<CreateProductResponse>>('/products', request);
  return res.data;
}

/** PUT /api/products/{id} */
export async function upsertProduct(
  id: string,
  request: CreateProductRequest,
): Promise<ApiResponse<Product>> {
  const res = await api.put<ApiResponse<Product>>(`/products/${id}`, request);
  return res.data;
}

/** PATCH /api/products/{id} */
export async function updateProduct(
  id: string,
  request: PartialProductUpdateRequest,
): Promise<ApiResponse<Product>> {
  const res = await api.patch<ApiResponse<Product>>(`/products/${id}`, request);
  return res.data;
}

/** PATCH /api/products/{id}/stock */
export async function updateProductPrice(
  id: string,
  request: PriceUpdateRequest,
): Promise<ApiResponse<Product>> {
  const res = await api.patch<ApiResponse<Product>>(`/products/${id}/stock`, request);
  return res.data;
}

/** PATCH /api/products/{id}/category */
export async function updateProductCategory(
  id: string,
  request: UpdateProductCategoryRequest,
): Promise<ApiResponse<Product>> {
  const res = await api.patch<ApiResponse<Product>>(`/products/${id}/category`, request);
  return res.data;
}
