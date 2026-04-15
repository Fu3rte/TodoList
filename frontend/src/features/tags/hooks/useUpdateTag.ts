import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { UpdateTagInput } from '../types/tag';

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagInput }) =>
      tagApi.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
