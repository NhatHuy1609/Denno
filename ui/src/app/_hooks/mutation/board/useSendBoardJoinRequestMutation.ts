import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"
import { boardTypesDto } from "@/service/api/board"

type SendJoinRequestMutationParams = {
  boardId: string
  createBoardJoinRequestDto: boardTypesDto.CreateBoardJoinRequestDto
}

function useSendBoardJoinRequestMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<boardTypesDto.BoardJoinRequestResponseDto>,
      DefaultError,
      SendJoinRequestMutationParams,
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
    mutationKey: ['board', 'joinRequest', 'create', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, createBoardJoinRequestDto }) => {
      const response = await BoardService.createBoardJoinRequestMutation(
        boardId, 
        { createBoardJoinRequestDto }
      )
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useSendBoardJoinRequestMutation