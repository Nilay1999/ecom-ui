import { useQuery } from '@tanstack/react-query';
import { getProducts, searchProducts } from '../api/productService';

export function useProducts(page = 0, size = 12) {
  return useQuery({
    queryKey: ['products', page, size],
    queryFn: () => getProducts(page, size),
  });
}

export function useSearchProducts(
  searchQuery: string,
  inStock: boolean,
  page: number,
  limit: number,
  sort: string,
) {
  return useQuery({
    queryKey: ['products', 'search', searchQuery, inStock, page, limit, sort],
    queryFn: () => searchProducts(searchQuery, inStock, page, limit, sort),
    enabled: searchQuery.trim().length > 0,
  });
}
