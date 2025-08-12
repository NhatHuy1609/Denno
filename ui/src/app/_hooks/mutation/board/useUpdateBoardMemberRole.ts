import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { BoardService } from '@/service/api/board'
import { boardTypesDto } from '@/service/api/board'

type SendJoinRequestMutationParams = {
  boardId: string
  memberId: string
  updateBoardMemberRoleRequestDto: boardTypesDto.UpdateBoardMemberRoleRequestDto
}

function useUpdateBoardMemberRole(
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
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['board', 'member-role', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, memberId, updateBoardMemberRoleRequestDto }) => {
      const response = await BoardService.updateBoardMemberRole({ boardId, memberId, updateBoardMemberRoleRequestDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateBoardMemberRole
