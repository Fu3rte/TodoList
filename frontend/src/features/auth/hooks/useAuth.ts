import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../stores/authStore';

export function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
