import { DefaultError, MutationOptions, useMutation } from "@tanstack/react-query";
import { CardListService, cardListTypesDto } from "@/service/api/cardList";

type UpdateCardListParams = {
  id: string
  updateCardListDto: cardListTypesDto.UpdateCardListDto
}

export default function useUpdateCardListMutation(
  options?: Pick<
    MutationOptions<
      Awaited<cardListTypesDto.CardListResponseDto>,
      DefaultError,
      UpdateCardListParams,
      unknown
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
    mutationKey: ['cardList', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ id, updateCardListDto }) => {
      const response = await CardListService.updateCardListMutation({ id, updateCardListDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}