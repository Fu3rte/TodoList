import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/api/categories');
    return response.data;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/api/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: UpdateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};