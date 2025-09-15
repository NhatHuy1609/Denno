import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'
import useAssignCardMemberMutation from './useAssignCardMemberMutation'

type RemoveCardMemberParams = {
  id: string
  removeCardMemberDto: cardTypesDto.RemoveCardMemberDto
}

function useRemoveCardMemberMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, RemoveCardMemberParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'remove', 'member', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, removeCardMemberDto }) => {
      const response = await CardService.removeCardMember(id, { removeCardMemberDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRemoveCardMemberMutation
