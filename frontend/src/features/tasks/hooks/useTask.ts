import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
}
