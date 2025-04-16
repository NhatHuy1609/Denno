import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { JoinWorkspaceByLinkActionResponseDto } from "@/service/api/action/action.types"

function useJoinWorkspaceByLinkMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<JoinWorkspaceByLinkActionResponseDto>,
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
    mutationKey: ['workspace', 'joinByLink', ...mutationKey],
    onMutate,
    mutationFn: async (workspaceId: string) => {
      const response = await WorkspaceService.joinWorkspaceByLinkMutation(workspaceId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useJoinWorkspaceByLinkMutation