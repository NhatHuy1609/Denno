import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { JoinRequestService } from "@/service/api/joinRequest"

type RejectMultipleWorkspaceJoinRequestParams = {
  requestIds: number[]
}

function useRejectMultipleWorkspaceJoinRequest(
  options: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      RejectMultipleWorkspaceJoinRequestParams,
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
    mutationKey: ['workspace', 'multiple', 'joinRequest', 'reject', ...mutationKey],
    onMutate,
    mutationFn: async ({ requestIds }) => {
      const responses = await Promise.all(
        requestIds.map((requestId) => JoinRequestService.rejectWorkspaceJoinRequest(requestId))
      )
      return responses.map((response) => response.data)
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRejectMultipleWorkspaceJoinRequest