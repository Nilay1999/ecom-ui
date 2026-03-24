/**
 * categoryService — maps 1:1 to CategoryController (/api/category)
 */
import { api } from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/common';
import type { CategoryResponse, CategoryTree, CreateCategoryRequest } from '../types/category';

/** POST /api/category */
export async function createCategory(
  request: CreateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  const res = await api.post<ApiResponse<CategoryResponse>>('/category', request);
  return res.data;
}

/** GET /api/category?page=0&size=5 */
export async function getCategories(
  page = 0,
  size = 20,
): Promise<ApiResponse<PageResponse<CategoryResponse>>> {
  const res = await api.get<ApiResponse<PageResponse<CategoryResponse>>>('/category', {
    params: { page, size },
  });
  return res.data;
}

/** GET /api/category/tree?page=0&size=5 */
export async function getCategoryTree(
  page = 0,
  size = 20,
): Promise<ApiResponse<PageResponse<CategoryTree>>> {
  const res = await api.get<ApiResponse<PageResponse<CategoryTree>>>('/category/tree', {
    params: { page, size },
  });
  return res.data;
}

/** GET /api/category/{id} */
export async function getCategoryById(id: string): Promise<ApiResponse<CategoryResponse>> {
  const res = await api.get<ApiResponse<CategoryResponse>>(`/category/${id}`);
  return res.data;
}

/** GET /api/category/parent/{parentId}/tree */
export async function getCategoryTreeByParent(
  parentId: string,
): Promise<ApiResponse<CategoryTree[]>> {
  const res = await api.get<ApiResponse<CategoryTree[]>>(`/category/parent/${parentId}/tree`);
  return res.data;
}

/** GET /api/category/slug/{slug} */
export async function getCategoryBySlug(slug: string): Promise<ApiResponse<CategoryResponse>> {
  const res = await api.get<ApiResponse<CategoryResponse>>(`/category/slug/${slug}`);
  return res.data;
}

/** PUT /api/category/{id} */
export async function upsertCategory(
  id: string,
  request: CreateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  const res = await api.put<ApiResponse<CategoryResponse>>(`/category/${id}`, request);
  return res.data;
}
