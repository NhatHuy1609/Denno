import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService, boardTypesDto } from "@/service/api/board"
import { enumTypes } from "@/service/api/_enums"

type ApproveBoardJoinRequestMutationParams = {
  requestId: number
  memberRole: enumTypes.BoardMemberRoleEnum
}

function useApproveBoardJoinRequest(
  options: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      ApproveBoardJoinRequestMutationParams,
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
    mutationFn: async ({requestId, memberRole}) => {
      const data = {
        requestId,
        approveBoardJoinRequestDto: {
          memberRole
        }
      }

      const response = await BoardService.approveBoardJoinRequest(data)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useApproveBoardJoinRequest