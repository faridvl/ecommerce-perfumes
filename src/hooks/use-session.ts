import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { AUTH_API_URL } from '@/shared/api/config';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { UserSessionResponse } from '@/types/auth/auth';

export function useSession() {
  const token = CookiesManager.getAccessToken();

  const { data, isLoading, error, isError } = useQuery<UserSessionResponse>({
    queryKey: ['auth-me'],
    queryFn: () => ApiServiceClient(AUTH_API_URL).get('/auth/me'),
    enabled: !!token,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });

  return {
    user: data?.user,
    tenant: data?.tenant,
    isLoading,
    isError,
    isAuthenticated: !!token && !isError,
  };
}
