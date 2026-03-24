import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryTree } from '../api/categoryService';

export function useCategories(page = 0, size = 50) {
  return useQuery({
    queryKey: ['categories', page, size],
    queryFn: () => getCategories(page, size),
  });
}

export function useCategoryTree(page = 0, size = 50) {
  return useQuery({
    queryKey: ['categories', 'tree', page, size],
    queryFn: () => getCategoryTree(page, size),
  });
}
