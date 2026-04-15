import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Tag, CreateTagInput, UpdateTagInput } from '../types/tag';

export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await axiosInstance.get<Tag[]>('/api/tags');
    return response.data;
  },

  createTag: async (data: CreateTagInput): Promise<Tag> => {
    const response = await axiosInstance.post<Tag>('/api/tags', data);
    return response.data;
  },

  updateTag: async (id: number, data: UpdateTagInput): Promise<Tag> => {
    const response = await axiosInstance.put<Tag>(`/api/tags/${id}`, data);
    return response.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tags/${id}`);
  },
};
