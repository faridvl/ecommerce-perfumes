import { ApiServiceClient } from '../../api-service-client';
import { AUTH_API_URL } from '../../config';
import { useApiMutation } from '../use-api-mutation';

export function useCreateUserMutation() {
  const {
    mutate: executeCreateUser,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createUser'],
    mutationFn: (values: any) => ApiServiceClient(AUTH_API_URL).post('/users', values),
  });

  return {
    executeCreateUser,
    isPending,
    isSuccess,
    error: error ? true : false,
    reset,
  };
}
