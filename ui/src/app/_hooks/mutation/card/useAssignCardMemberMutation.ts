import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'

type AssignCardMemberParams = {
  id: string
  assignCardMemberDto: cardTypesDto.AssignCardMemberDto
}

function useAssignCardMemberMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, AssignCardMemberParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'assign', 'member', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, assignCardMemberDto }) => {
      const response = await CardService.assignCardMember(id, { assignCardMemberDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useAssignCardMemberMutation
