import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { JoinRequestService } from "@/service/api/joinRequest"
import { joinRequestTypesDto } from "@/service/api/joinRequest"


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
      const response = await JoinRequestService.approveWorkspaceJoinRequest(requestId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useApproveWorkspaceJoinRequest