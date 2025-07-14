import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"
import { boardTypesDto } from "@/service/api/board"

type VerifyBoardInvitationSecretParams = {
  boardId: string
  secretCode: string
}

function useVerifyBoardInvitationSecret(
  options: Pick<
    UseMutationOptions<
      Awaited<any>,
      DefaultError,
      VerifyBoardInvitationSecretParams,
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
    mutationKey: ['board', 'invitationSecret', 'verification', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, secretCode }) => {
      const verifyInvitationSecretDto = {
        secretCode
      } as boardTypesDto.VerifyBoardInvitationSecretRequestDto

      const response = await BoardService
        .verifyBoardInvitationSecretMutation({
          boardId,
          verifyInvitationSecretDto
        })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useVerifyBoardInvitationSecret