import { AuthService, authTypesDto } from '@/service/api/auth';
import { DefaultError, UseMutationOptions, useMutation } from '@tanstack/react-query'

export function useLoginGoogleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.loginGoogleMutation>>,
      DefaultError,
      authTypesDto.LoginGoogleDto,
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

  return useMutation({
    mutationKey: ['sign-in', 'sign-in-google', ...mutationKey],
    mutationFn: (loginGoogleDto: authTypesDto.LoginGoogleDto) => {
      return AuthService.loginGoogleMutation({ loginGoogleDto })
    },
    onMutate,
    onSuccess,
    onError,
    onSettled
  })
}