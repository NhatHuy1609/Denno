import { cardTypesDto } from "@/service/api/card";
import { Card,Cards } from "./card.types";

export function transformCardDtoToCard(
  cardDto: cardTypesDto.CardResponseDto
): Card {
  return {
    ...cardDto
  }
}

export function transformCardsDtoToCards(
  cardsDto: cardTypesDto.CardsResponseDto
): Cards {
  return cardsDto.map(c => transformCardDtoToCard(c))
}