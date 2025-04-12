import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { workspaceTypesDto } from "@/service/api/workspace"

function useCreateInvitationSecretMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<workspaceTypesDto.WorkspaceInvitationSecretResponseDto>,
      DefaultError,
      string,
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
    mutationKey: ['workspace', 'invitationSecret', ...mutationKey],
    onMutate,
    mutationFn: async (workspaceId: string) => {
      const response = await WorkspaceService.createWorkspaceInvitationSecretMutation(workspaceId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useCreateInvitationSecretMutation