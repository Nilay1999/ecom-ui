/**
 * orderService — maps 1:1 to OrderController (/api/orders)
 */
import { api } from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from '../types/order';

/** POST /api/orders */
export async function createOrder(
  request: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> {
  const res = await api.post<ApiResponse<OrderResponse>>('/orders', request);
  return res.data;
}

/** GET /api/orders/{id} */
export async function getOrderById(id: string): Promise<ApiResponse<OrderResponse>> {
  const res = await api.get<ApiResponse<OrderResponse>>(`/orders/${id}`);
  return res.data;
}

/** GET /api/orders/by-order-number/{orderNumber} */
export async function getOrderByOrderNumber(
  orderNumber: string,
): Promise<ApiResponse<OrderResponse>> {
  const res = await api.get<ApiResponse<OrderResponse>>(`/orders/by-order-number/${orderNumber}`);
  return res.data;
}

/** GET /api/orders/user/{userId}?page=0&size=5 */
export async function getOrdersByUser(
  userId: string,
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<OrderResponse>>> {
  const res = await api.get<ApiResponse<PageResponse<OrderResponse>>>(`/orders/user/${userId}`, {
    params: { page, size },
  });
  return res.data;
}

/** PATCH /api/orders/{id}/status */
export async function updateOrderStatus(
  id: string,
  request: UpdateOrderStatusRequest,
): Promise<ApiResponse<OrderResponse>> {
  const res = await api.patch<ApiResponse<OrderResponse>>(`/orders/${id}/status`, request);
  return res.data;
}

/** DELETE /api/orders/{id} */
export async function cancelOrder(id: string): Promise<ApiResponse<void>> {
  const res = await api.delete<ApiResponse<void>>(`/orders/${id}`);
  return res.data;
}
