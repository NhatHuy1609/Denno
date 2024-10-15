import { AuthService, authTypesDto } from '@/service/api/auth';
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useAppDispatch } from '@/store/hooks'
import { updateCurrentUser, updateSession } from '@/store/features/session'

export function useLoginMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.loginUserMutation>>,
      DefaultError,
      authTypesDto.LoginUserDto,
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
    mutationKey: ['sign-in', ...mutationKey],
    onMutate: async (variables) => {
      dispatch(updateCurrentUser({
        email: variables.email
      }))

      await onMutate?.(variables)
    },
    mutationFn: async (loginUserDto: authTypesDto.LoginUserDto)  => {
      return AuthService.loginUserMutation({loginUserDto})
    },
    onSuccess: async (response, variables, context) => {
      const { data } = response
      const { accessToken, refreshToken } = data

      dispatch(updateSession({
        token: accessToken,
        refreshToken
      }))

      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}