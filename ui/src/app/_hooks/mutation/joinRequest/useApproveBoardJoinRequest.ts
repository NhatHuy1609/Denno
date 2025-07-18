import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"

function useApproveBoardJoinRequest(
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
    mutationKey: ['board', 'joinRequest', 'approve', ...mutationKey],
    onMutate,
    mutationFn: async (requestId) => {
      const response = await BoardService.approveBoardJoinRequest(requestId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useApproveBoardJoinRequest