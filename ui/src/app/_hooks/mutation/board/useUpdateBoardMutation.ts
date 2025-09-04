import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { BoardService } from '@/service/api/board'
import { boardTypesDto } from '@/service/api/board'

type UpdateBoardMutationParams = {
  boardId: string
  updateBoardRequestDto: boardTypesDto.UpdateBoardRequestDto
}

function useUpdateBoardMutation(
  options: Pick<
    UseMutationOptions<Awaited<boardTypesDto.BoardResponseDto>, DefaultError, UpdateBoardMutationParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['board', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, updateBoardRequestDto }) => {
      const response = await BoardService.updateBoard(boardId, { updateBoardDto: updateBoardRequestDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateBoardMutation
