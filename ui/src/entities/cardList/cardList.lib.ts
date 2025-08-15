import { cardListTypesDto } from '@/service/api/cardList'
import { CardList, CardLists } from './cardList.schemas'

export function transformCardListDtoToCardList(cardListDto: cardListTypesDto.CardListResponseDto): CardList {
  return {
    ...cardListDto
  }
}

export function transformCardListsDtoToCardLists(
  cardListsDto: cardListTypesDto.CardListsByBoardResponseDto
): CardLists {
  return cardListsDto.map((c) => transformCardListDtoToCardList(c))
}
