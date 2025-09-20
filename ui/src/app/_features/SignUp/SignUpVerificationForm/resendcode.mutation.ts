import { AuthService, authTypesDto } from '@/service/api/auth'
import { DefaultError, UseMutationOptions, useMutation } from '@tanstack/react-query'

export function useResendCodeMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.resendRegisterCodeMutation>>,
      DefaultError,
      authTypesDto.ResendRegisterCodeDto,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options || {}

  return useMutation({
    mutationKey: ['sign-up', 'resend-code', ...mutationKey],
    mutationFn: async (resendRegisterCodeDto: authTypesDto.ResendRegisterCodeDto) => {
      return AuthService.resendRegisterCodeMutation({ resendRegisterCodeDto })
    },
    onMutate,
    onSuccess,
    onError,
    onSettled
  })
}
