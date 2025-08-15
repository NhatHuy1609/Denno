import { cardTypesDto } from '@/service/api/card'
import { cardSchemas } from '.'

export function transformCardDtoToCard(cardDto: cardTypesDto.CardResponseDto): cardSchemas.Card {
  return {
    ...cardDto
  }
}

export function transformCardsDtoToCards(cardsDto: cardTypesDto.CardsResponseDto): cardSchemas.Cards {
  return cardsDto.map((c) => transformCardDtoToCard(c))
}
