import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { suggestProducts } from '../api/productService';

/**
 * Debounced autocomplete for the search boxes.
 * Backed by the Trie-powered GET /products/suggest endpoint.
 */
export function useProductSuggestions(input: string, delay = 250) {
  const [debounced, setDebounced] = useState(input);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), delay);
    return () => clearTimeout(t);
  }, [input, delay]);

  const query = useQuery({
    queryKey: ['products', 'suggest', debounced],
    queryFn: () => suggestProducts(debounced),
    enabled: debounced.length >= 2,
    staleTime: 60_000,
  });

  return {
    suggestions: query.data ?? [],
    isLoading: query.isFetching,
  };
}
