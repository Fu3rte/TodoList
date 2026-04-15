import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import type { TaskFilters } from '../types/task';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
  });
}
