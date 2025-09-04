import { AuthService } from '@/service/api/auth'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

function useRevokeTokenMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, void, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['auth', 'revokeToken', ...mutationKey],
    onMutate,
    mutationFn: async () => {
      const response = await AuthService.revokeToken()
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRevokeTokenMutation
