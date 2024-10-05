import { DefaultError, UseMutationOptions, useMutation } from '@tanstack/react-query'
import { AuthService, authTypesDto } from '@/service/api/auth'
import { useAppDispatch } from '@/store/hooks'
import { sessionStoreLib } from '@/store/features/session';
import { updateCurrentUser } from '@/store/features/session/session.slice';

export function useRegisterUserMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.registerUserMutation>>,
      DefaultError,
      authTypesDto.RegisterUserDto,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['session', 'register-user', ...mutationKey],
    mutationFn: async (registerUserDto: authTypesDto.RegisterUserDto) => {
      return AuthService.registerUserMutation({ registerUserDto })
    },
    onMutate: async (variables) => {
      const { email } = variables
      dispatch(updateCurrentUser({
        email
      }))

      await onMutate?.(variables)
    },
    onSuccess,
    onError,
    onSettled
  })
}
