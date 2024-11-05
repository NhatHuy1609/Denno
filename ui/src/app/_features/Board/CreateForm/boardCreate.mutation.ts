import { UseMutationOptions, DefaultError, useMutation } from '@tanstack/react-query'
import  { boardTypesDto, BoardService } from '@/service/api/board'

export function useCreateBoardMutation(
  options: Pick<
  UseMutationOptions<
    any,
    DefaultError,
    boardTypesDto.CreateBoardDto,
    unknown
  >, 'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'>
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

  return useMutation({
    mutationKey: ['board', 'create', ...mutationKey],
    onMutate,
    mutationFn: async (createBoardDto: boardTypesDto.CreateBoardDto) => {
      return BoardService.createBoardMutation({ createBoardDto })
    },
    onSuccess,
    onError,
    onSettled
  })
}