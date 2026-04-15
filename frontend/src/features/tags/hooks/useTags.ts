import { useQuery } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags(),
  });
}
