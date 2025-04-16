import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { workspaceTypesDto } from "@/service/api/workspace"

type VerifyWorkspaceInvitationSecretParams = {
  workspaceId: string
  secretCode: string
}

function useVerifyWorkspaceInvitationSecret(
  options: Pick<
    UseMutationOptions<
      Awaited<any>,
      DefaultError,
      VerifyWorkspaceInvitationSecretParams,
      any
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
  } = options

  return useMutation({
    mutationKey: ['workspace', 'invitationSecret', 'verification', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, secretCode }) => {
      const verifyInvitationSecretDto = {
        secretCode
      } as workspaceTypesDto.VerifyWorkspaceInvitationSecretRequestDto

      const response = await WorkspaceService
        .verifyWorkspaceInvitationSecretMutation(workspaceId, {
          verifyInvitationSecretDto
        })

      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useVerifyWorkspaceInvitationSecret