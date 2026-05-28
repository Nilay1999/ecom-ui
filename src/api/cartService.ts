/**
 * cartService — maps 1:1 to CartController (/api/cart)
 * All endpoints require a JWT; the user is resolved server-side from the token.
 */
import { api } from './axiosInstance';
import type { ApiResponse } from '../types/common';
import type { AddCartItemRequest, CartResponse, UpdateCartItemRequest } from '../types/cart';

/** GET /api/cart */
export async function getCart(): Promise<ApiResponse<CartResponse>> {
  const res = await api.get<ApiResponse<CartResponse>>('/cart');
  return res.data;
}

/** POST /api/cart/items */
export async function addCartItem(request: AddCartItemRequest): Promise<ApiResponse<CartResponse>> {
  const res = await api.post<ApiResponse<CartResponse>>('/cart/items', request);
  return res.data;
}

/** PUT /api/cart/items/{productId} */
export async function updateCartItem(
  productId: string,
  request: UpdateCartItemRequest,
): Promise<ApiResponse<CartResponse>> {
  const res = await api.put<ApiResponse<CartResponse>>(`/cart/items/${productId}`, request);
  return res.data;
}

/** DELETE /api/cart/items/{productId} */
export async function removeCartItem(productId: string): Promise<ApiResponse<CartResponse>> {
  const res = await api.delete<ApiResponse<CartResponse>>(`/cart/items/${productId}`);
  return res.data;
}

/** DELETE /api/cart */
export async function clearCart(): Promise<ApiResponse<void>> {
  const res = await api.delete<ApiResponse<void>>('/cart');
  return res.data;
}
