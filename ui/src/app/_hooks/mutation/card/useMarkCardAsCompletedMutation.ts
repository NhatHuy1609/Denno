import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'

type MarkCardAsCompletedParams = {
  id: string
}

function useMarkCardAsCompletedMutation(
  options: Pick<
    UseMutationOptions<Awaited<cardTypesDto.CardResponseDto>, DefaultError, MarkCardAsCompletedParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'completed', ...mutationKey],
    onMutate,
    mutationFn: async ({ id }) => {
      const response = await CardService.markAsCompleted(id)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useMarkCardAsCompletedMutation
