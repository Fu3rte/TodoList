import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { CreateTaskInput } from '../types/task';

export function useCreateTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
}
