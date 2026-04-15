import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.toggleTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousData = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: { tasks: Array<{ id: number; is_completed: boolean }> } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === id ? { ...t, is_completed: !t.is_completed } : t
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['tasks'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
