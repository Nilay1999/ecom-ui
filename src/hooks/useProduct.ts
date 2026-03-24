import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductById,
  updateProduct,
  updateProductPrice,
  updateProductCategory,
} from '../api/productService';
import type { PartialProductUpdateRequest, PriceUpdateRequest, UpdateProductCategoryRequest } from '../types/product';

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PartialProductUpdateRequest) => updateProduct(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductPrice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PriceUpdateRequest) => updateProductPrice(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}

export function useUpdateProductCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateProductCategoryRequest) => updateProductCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}
