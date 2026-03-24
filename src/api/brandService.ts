/**
 * brandService — maps 1:1 to BrandController (/api/brand)
 */
import { api } from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  BrandResponse,
  PaginatedBrand,
  CreateBrandRequest,
  UpdateBrandRequest,
  UpdateBrandStatusRequest,
} from '../types/brand';
import type { Product } from '../types/product';

/** GET /api/brand?page=0&size=5 */
export async function getBrands(
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<PaginatedBrand>>> {
  const res = await api.get<ApiResponse<PageResponse<PaginatedBrand>>>('/brand', {
    params: { page, size },
  });
  return res.data;
}

/** GET /api/brand/{id} */
export async function getBrandById(id: string): Promise<ApiResponse<BrandResponse>> {
  const res = await api.get<ApiResponse<BrandResponse>>(`/brand/${id}`);
  return res.data;
}

/** GET /api/brand/{id}/product */
export async function getProductsByBrand(id: string): Promise<ApiResponse<Product[]>> {
  const res = await api.get<ApiResponse<Product[]>>(`/brand/${id}/product`);
  return res.data;
}

/** POST /api/brand */
export async function createBrand(request: CreateBrandRequest): Promise<ApiResponse<BrandResponse>> {
  const res = await api.post<ApiResponse<BrandResponse>>('/brand', request);
  return res.data;
}

/** PATCH /api/brand/{id} */
export async function updateBrand(
  id: string,
  request: UpdateBrandRequest,
): Promise<ApiResponse<BrandResponse>> {
  const res = await api.patch<ApiResponse<BrandResponse>>(`/brand/${id}`, request);
  return res.data;
}

/** PATCH /api/brand/{id}/status */
export async function toggleBrandStatus(
  id: string,
  request: UpdateBrandStatusRequest,
): Promise<ApiResponse<BrandResponse>> {
  const res = await api.patch<ApiResponse<BrandResponse>>(`/brand/${id}/status`, request);
  return res.data;
}

/** DELETE /api/brand/{id} */
export async function deleteBrand(id: string): Promise<ApiResponse<boolean>> {
  const res = await api.delete<ApiResponse<boolean>>(`/brand/${id}`);
  return res.data;
}
