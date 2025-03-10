import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { CardService, cardTypesDto } from "@/service/api/card"

type UpdateCardRankParams = {
  id: string
  updateCardRankDto: cardTypesDto.UpdateCardRankDto
}

function useUpdateCardRankMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<cardTypesDto.UpdateCardRankResponseDto>,
      DefaultError,
      UpdateCardRankParams,
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
    mutationKey: ['card', 'update', 'rank',  ...mutationKey],
    onMutate,
    mutationFn: async ({id, updateCardRankDto}) => {
      const response = await CardService.updateCardRankMutation({id, updateCardRankDto})
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateCardRankMutation