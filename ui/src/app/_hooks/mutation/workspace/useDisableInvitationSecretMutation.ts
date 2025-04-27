import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"

function useDisableInvitationSecretMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<any>,
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
    mutationKey: ['workspace', 'invitationSecret', 'disable', ...mutationKey],
    onMutate,
    mutationFn: async (workspaceId: string) => {
      const response = await WorkspaceService.disableWorkspaceInvitationSecretMutation(workspaceId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useDisableInvitationSecretMutation