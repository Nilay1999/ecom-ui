/**
 * productImageService — maps 1:1 to ProductImageController (/api/product-images)
 */
import { api } from './axiosInstance';
import type { ApiResponse } from '../types/common';
import type { ProductImageRequest, ProductImageResponse, ImageOrderRequest } from '../types/image';

/** POST /api/product-images/upload/{productId} — multipart upload */
export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<ApiResponse<Record<string, string>>> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<ApiResponse<Record<string, string>>>(
    `/product-images/upload/${productId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data;
}

/** POST /api/product-images */
export async function addImageToProduct(
  request: ProductImageRequest,
): Promise<ApiResponse<ProductImageResponse>> {
  const res = await api.post<ApiResponse<ProductImageResponse>>('/product-images', request);
  return res.data;
}

/** GET /api/product-images/{id} */
export async function getProductImages(
  productId: string,
): Promise<ApiResponse<ProductImageResponse[]>> {
  const res = await api.get<ApiResponse<ProductImageResponse[]>>(`/product-images/${productId}`);
  return res.data;
}

/** PATCH /api/product-images/{imageId}/primary */
export async function setPrimaryImage(
  imageId: string,
): Promise<ApiResponse<ProductImageResponse[]>> {
  const res = await api.patch<ApiResponse<ProductImageResponse[]>>(
    `/product-images/${imageId}/primary`,
  );
  return res.data;
}

/** PUT /api/product-images/order */
export async function reorderImages(
  request: ImageOrderRequest,
): Promise<ApiResponse<ProductImageResponse[]>> {
  const res = await api.put<ApiResponse<ProductImageResponse[]>>('/product-images/order', request);
  return res.data;
}

/** DELETE /api/product-images/{imageId} */
export async function deleteProductImage(imageId: string): Promise<ApiResponse<void>> {
  const res = await api.delete<ApiResponse<void>>(`/product-images/${imageId}`);
  return res.data;
}
