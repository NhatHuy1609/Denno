import { PersistedStateKey } from '@/data/persisted-keys'
import { setLocalStorageItem } from '@/utils/local-storage'
import { AuthService, authTypesDto } from '@/service/api/auth';
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useAppDispatch } from '@/store/hooks'
import { updateCurrentUser, updateEntireSession } from '@/store/features/session'

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
  const dispatch = useAppDispatch()

  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

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
      const { accessToken, refreshToken, user } = data

      setLocalStorageItem(PersistedStateKey.MeId, user.id)
      setLocalStorageItem(PersistedStateKey.Token, accessToken)
      setLocalStorageItem(PersistedStateKey.RefreshToken, refreshToken)

      // dispatch(updateEntireSession({
      //   session: {
      //     token: accessToken,
      //     refreshToken
      //   },
      //   currentUser: user
      // }))

      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}