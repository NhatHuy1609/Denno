import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"

function useApproveWorkspaceJoinRequest(
  options: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      number,
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
    mutationKey: ['workspace', 'joinRequest', 'approve', ...mutationKey],
    onMutate,
    mutationFn: async (requestId) => {
      const response = await WorkspaceService.approveWorkspaceJoinRequest(requestId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useApproveWorkspaceJoinRequest