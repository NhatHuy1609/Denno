import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { CardService, cardTypesDto } from "@/service/api/card"

function useCreateCardMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<cardTypesDto.CreateCardResponseDto>,
      DefaultError,
      cardTypesDto.CreateCardDto,
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
    mutationKey: ['card', 'create', ...mutationKey],
    onMutate,
    mutationFn: async (createCardDto: cardTypesDto.CreateCardDto) => {
      const response = await CardService.createCardMutation({createCardDto})
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useCreateCardMutation