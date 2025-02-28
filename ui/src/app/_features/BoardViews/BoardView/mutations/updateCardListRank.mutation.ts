import { DefaultError, MutationOptions, useMutation } from "@tanstack/react-query";
import { CardListService, cardListTypesDto } from "@/service/api/cardList";

type UpdateCardListRankParams = {
  id: string
  updateCardListRankDto: cardListTypesDto.UpdateCardListRankDto
}

export default function useUpdateCardListRankMutation(
  options?: Pick<
    MutationOptions<
      Awaited<cardListTypesDto.CardListResponseDto>,
      DefaultError,
      UpdateCardListRankParams,
      any
    >,
    'mutationKey' | 'onMutate' | 'onSettled' | 'onSuccess' | 'onError'
  >
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

  return useMutation({
    mutationKey: ['cardList', 'update', 'rank', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, updateCardListRankDto }) => {
      const response = await CardListService.updateCardListRankMutation({ id, updateCardListRankDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}