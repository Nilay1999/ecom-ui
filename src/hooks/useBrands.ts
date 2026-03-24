import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '../api/brandService';
import type { CreateBrandRequest, UpdateBrandRequest } from '../types/brand';

export function useBrands(page = 0, size = 20) {
  return useQuery({
    queryKey: ['brands', page, size],
    queryFn: () => getBrands(page, size),
  });
}

export function useBrand(id: string | undefined) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: () => getBrandById(id!),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateBrandRequest) => createBrand(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useUpdateBrand(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateBrandRequest) => updateBrand(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}
