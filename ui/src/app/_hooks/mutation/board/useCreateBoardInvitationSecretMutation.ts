import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"
import { boardTypesDto } from "@/service/api/board"

interface CreateBoardInvitationSecretMutationParams {
  boardId: string,
  createBoardInvitationSecretDto: boardTypesDto.CreateBoardInvitationSecretDto
}

function useCreateBoardInvitationSecretMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<boardTypesDto.BoardInvitationSecretResponseDto>,
      DefaultError,
      CreateBoardInvitationSecretMutationParams,
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
    mutationKey: ['board', 'invitationSecret', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, createBoardInvitationSecretDto }) => {
      // Default role can be 'Member', adjust as needed
      const response = await BoardService.createBoardInvitationSecret({
        boardId,
        createBoardInvitationSecretDto
      })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useCreateBoardInvitationSecretMutation