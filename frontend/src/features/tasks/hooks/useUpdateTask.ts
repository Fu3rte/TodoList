import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { UpdateTaskInput } from '../types/task';

export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate(`/tasks/${id}`);
    },
  });
}
