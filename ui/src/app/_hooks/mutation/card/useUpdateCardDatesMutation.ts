import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'

type UpdateCardDatesParams = {
  id: string
  updateCardDatesDto: cardTypesDto.UpdateCardDatesDto
}

function useUpdateCardDatesMutation(
  options: Pick<
    UseMutationOptions<Awaited<cardTypesDto.CardResponseDto>, DefaultError, UpdateCardDatesParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'update-dates', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, updateCardDatesDto }) => {
      const response = await CardService.updateCardDates(id, { updateCardDatesDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateCardDatesMutation
