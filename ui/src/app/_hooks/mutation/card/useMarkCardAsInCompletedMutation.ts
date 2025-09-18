import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { CardService, cardTypesDto } from '@/service/api/card'

type MarkCardAsInCompletedParams = {
  id: string
}

function useMarkCardAsInCompletedMutation(
  options: Pick<
    UseMutationOptions<Awaited<cardTypesDto.CardResponseDto>, DefaultError, MarkCardAsInCompletedParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['card', 'inCompleted', ...mutationKey],
    onMutate,
    mutationFn: async ({ id }) => {
      const response = await CardService.markAsInCompleted(id)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useMarkCardAsInCompletedMutation
