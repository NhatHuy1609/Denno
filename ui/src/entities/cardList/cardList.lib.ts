import { cardListTypesDto } from '@/service/api/cardList'
import { CardList, CardLists } from './cardList.schemas'
import { transformCardDtoToCard } from '../card/card.lib'

export function transformCardListDtoToCardList(cardListDto: cardListTypesDto.CardListResponseDto): CardList {
  return {
    ...cardListDto,
    cards: cardListDto.cards.map((c) => transformCardDtoToCard(c))
  }
}

export function transformCardListsDtoToCardLists(
  cardListsDto: cardListTypesDto.CardListsByBoardResponseDto
): CardLists {
  return cardListsDto.map((c) => transformCardListDtoToCardList(c))
}
