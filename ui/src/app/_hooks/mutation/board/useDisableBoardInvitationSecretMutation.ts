import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"

function useDisableBoardInvitationSecretMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<any>,
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
    mutationKey: ['board', 'invitationSecret', 'disable', ...mutationKey],
    onMutate,
    mutationFn: async (boardId: string) => {
      const response = await BoardService.deleteBoardInvitationSecret(boardId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useDisableBoardInvitationSecretMutation