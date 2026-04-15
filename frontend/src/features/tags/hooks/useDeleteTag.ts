import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
