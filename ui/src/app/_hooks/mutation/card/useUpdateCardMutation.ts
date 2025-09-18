import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'

type UpdateCardParams = {
  id: string
  updateCardDto: cardTypesDto.UpdateCardDto
}

function useUpdateCardMutation(
  options: Pick<
    UseMutationOptions<Awaited<cardTypesDto.CardResponseDto>, DefaultError, UpdateCardParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, updateCardDto }) => {
      const response = await CardService.updateCard({ id, updateCardDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateCardMutation
