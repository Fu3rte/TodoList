import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { CreateTagInput } from '../types/tag';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagApi.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
