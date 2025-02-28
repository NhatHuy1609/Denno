import { DefaultError, MutationOptions, useMutation } from "@tanstack/react-query";
import { CardListService, cardListTypesDto } from "@/service/api/cardList";

export default function useCreateCardListMutation(
  options?: Pick<
    MutationOptions<
      Awaited<cardListTypesDto.CardListResponseDto>,
      DefaultError,
      cardListTypesDto.CreateCardListDto,
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
    mutationKey: ['cardList', 'create', ...mutationKey],
    onMutate,
    mutationFn: async (createCardListDto: cardListTypesDto.CreateCardListDto) => {
      const response = await CardListService.createCardListMutation({ createCardListDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}