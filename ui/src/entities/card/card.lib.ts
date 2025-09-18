import { cardTypesDto } from '@/service/api/card'
import { cardSchemas } from '.'
import { userLib } from '../user'

export function transformCardDtoToCard(cardDto: cardTypesDto.CardResponseDto): cardSchemas.Card {
  const { members, ...rest } = cardDto

  return {
    ...rest,
    memberIds: members?.map((m) => m.id)
  }
}

export function transformCardsDtoToCards(cardsDto: cardTypesDto.CardsResponseDto): cardSchemas.Cards {
  return cardsDto.map((c) => transformCardDtoToCard(c))
}

export function normalizeCardDto(cardDto: cardTypesDto.CardResponseDto) {
  const { members } = cardDto

  return {
    card: transformCardDtoToCard(cardDto),
    members: new Map(
      members.map((member) => {
        const user = userLib.transformUserDtoToUser(member)
        return [user.id, user]
      })
    )
  }
}

export function normalizeCardMembersDto(cardMembersDto: cardTypesDto.CardMembersResponseDto) {
  const { cardId, members } = cardMembersDto

  return {
    cardId,
    members: members.map((member) => {
      const user = userLib.transformUserDtoToUser(member)
      return user
    })
  }
}
