import axiosInstance from '../../../shared/lib/axiosInstance';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../types/auth';

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await axiosInstance.post<User>('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    const response = await axiosInstance.post<AuthTokens>('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/api/auth/me');
    return response.data;
  },
};
