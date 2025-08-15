import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"
import { actionTypesDto } from "@/service/api/action"

function useJoinBoardByLinkMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<actionTypesDto.JoinBoardByLinkActionResponseDto>,
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
    mutationKey: ['board', 'joinByLink', ...mutationKey],
    onMutate,
    mutationFn: async (boardId: string) => {
      const response = await BoardService.joinBoardByLinkMutation(boardId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useJoinBoardByLinkMutation