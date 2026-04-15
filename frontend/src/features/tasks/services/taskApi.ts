import axiosInstance from '../../../shared/lib/axiosInstance';
import type {
  Task,
  TaskFilters,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

export const taskApi = {
  getTasks: async (filters?: TaskFilters): Promise<TaskListResponse> => {
    const response = await axiosInstance.get<TaskListResponse>('/api/tasks', { params: filters });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await axiosInstance.post<Task>('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskInput): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  toggleTask: async (id: number): Promise<{ is_completed: boolean }> => {
    const response = await axiosInstance.patch<{ is_completed: boolean }>(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tasks/${id}`);
  },
};
