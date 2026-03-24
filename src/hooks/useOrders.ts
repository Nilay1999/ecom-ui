import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../api/orderService';
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/order';

export function useOrdersByUser(userId: string | undefined, page = 0, size = 10) {
  return useQuery({
    queryKey: ['orders', 'user', userId, page, size],
    queryFn: () => getOrdersByUser(userId!, page, size),
    enabled: !!userId,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOrderRequest) => createOrder(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'user', data.data.userId] });
    },
  });
}

export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateOrderStatusRequest) => updateOrderStatus(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
