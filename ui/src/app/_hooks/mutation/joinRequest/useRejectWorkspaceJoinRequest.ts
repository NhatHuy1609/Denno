import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { JoinRequestService } from "@/service/api/joinRequest"

function useRejectWorkspaceJoinRequest(
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
    mutationKey: ['workspace', 'joinRequest', 'reject', ...mutationKey],
    onMutate,
    mutationFn: async (requestId) => {
      const response = await JoinRequestService.rejectWorkspaceJoinRequest(requestId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRejectWorkspaceJoinRequest