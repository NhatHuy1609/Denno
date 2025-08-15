import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"

type RejectMultipleBoardJoinRequestParams = {
  requestIds: number[]
}

function useRejectMultipleBoardJoinRequest(
  options: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      RejectMultipleBoardJoinRequestParams,
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
    mutationKey: ['board', 'multiple', 'joinRequest', 'reject', ...mutationKey],
    onMutate,
    mutationFn: async ({ requestIds }) => {
      const responses = await Promise.all(
        requestIds.map((requestId) => BoardService.rejectBoardJoinRequest(requestId))
      )
      return responses.map((response) => response.data)
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRejectMultipleBoardJoinRequest