import { DefaultError, UseMutationOptions, useMutation } from '@tanstack/react-query'
import { AuthService, authTypesDto } from '@/service/api/auth'
import { sessionStoreLib } from '@/store/features/session'
import { updateSession } from '@/store/features/session'
import { useDispatch } from 'react-redux'

export function useValidateRegisterUserMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.validateRegisterUserMutation>>,
      DefaultError,
      authTypesDto.ValidateRegisterUserDto,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options || {}

  const dispatch = useDispatch()

  return useMutation({
    mutationKey: ['register-user', 'validate-email', ...mutationKey],
    onMutate,
    mutationFn: async (validateRegisterUserDto: authTypesDto.ValidateRegisterUserDto) => {
      return AuthService.validateRegisterUserMutation({
        validateRegisterUserDto
      })
    },
    onSuccess: async (response, variables, context) => {
      const data = response.data
      const sessionData = sessionStoreLib.transformLoginResponseDtoToSession(data)

      dispatch(updateSession(sessionData))

      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}
