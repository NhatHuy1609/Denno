import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"

type ApproveMultipleBoardJoinRequestParams = {
  requestIds: number[]
}

function useApproveMultipleBoardJoinRequest(
  options: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      ApproveMultipleBoardJoinRequestParams,
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
    mutationKey: ['board', 'multiple', 'joinRequest', 'approve', ...mutationKey],
    onMutate,
    mutationFn: async ({ requestIds }) => {
      const responses = await Promise.all(
        requestIds.map((requestId) => BoardService.approveBoardJoinRequest(requestId))
      )
      return responses.map((response) => response.data)
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useApproveMultipleBoardJoinRequest