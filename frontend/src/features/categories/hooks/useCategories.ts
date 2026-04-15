import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  });
}