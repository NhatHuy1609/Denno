import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { httpDel, httpGet, httpPost, httpPut } from '../_req'
import {
  AssignCardMemberDto,
  CardMembersResponseDto,
  CardResponseDto,
  CardsByCardListResponseDto,
  CreateCardDto,
  CreateCardResponseDto,
  RemoveCardMemberDto,
  UpdateCardDatesDto,
  UpdateCardDto,
  UpdateCardRankDto,
  UpdateCardRankResponseDto
} from './card.types'
import {
  AssignCardMemberDtoSchema,
  CreateCardDtoSchema,
  RemoveCardMemberDtoSchema,
  UpdateCardDatesDtoSchema,
  UpdateCardDtoSchema,
  UpdateCardRankDtoSchema
} from './card.contracts'
import { CardQueryModelDto } from '../_models/query-models/card/card.types'

export class CardService {
  static cardsByCardListQuery(data: { cardListId: string }, config: { signal?: AbortSignal }) {
    const { cardListId } = data

    return httpGet<CardsByCardListResponseDto>(`/cardLists/${cardListId}/cards`)
  }

  static getCardMembers(cardId: string) {
    return httpGet<CardMembersResponseDto>(`/cards/${cardId}/members`)
  }

  static createCardMutation(data: { createCardDto: CreateCardDto }) {
    const createCardDto = AxiosContracts.requestContract(CreateCardDtoSchema, data.createCardDto)

    return httpPost<CreateCardResponseDto>('/cards', createCardDto)
  }

  static updateCardRankMutation(data: { id: string; updateCardRankDto: UpdateCardRankDto }) {
    const updateCardRankDto = AxiosContracts.requestContract(UpdateCardRankDtoSchema, data.updateCardRankDto)

    return httpPut<UpdateCardRankResponseDto>(`/cards/${data.id}/rank`, updateCardRankDto)
  }

  static updateCard(data: { id: string; updateCardDto: UpdateCardDto }) {
    const updateCardDto = AxiosContracts.requestContract(UpdateCardDtoSchema, data.updateCardDto)

    return httpPut<CardResponseDto>(`/cards/${data.id}`, updateCardDto)
  }

  static markAsCompleted(id: string) {
    return httpPut<CardResponseDto>(`/cards/${id}/completion`)
  }

  static markAsInCompleted(id: string) {
    return httpPut<CardResponseDto>(`/cards/${id}/incompletion`)
  }

  static assignCardMember(id: string, data: { assignCardMemberDto: AssignCardMemberDto }) {
    const assignCardMemberDto = AxiosContracts.requestContract(AssignCardMemberDtoSchema, data.assignCardMemberDto)
    return httpPost(`/cards/${id}/members/assign`, assignCardMemberDto)
  }

  static removeCardMember(id: string, data: { removeCardMemberDto: RemoveCardMemberDto }) {
    const removeCardMemberDto = AxiosContracts.requestContract(RemoveCardMemberDtoSchema, data.removeCardMemberDto)
    return httpPost(`/cards/${id}/members/remove`, removeCardMemberDto)
  }

  static getCard(id: string, config?: { signal?: AbortSignal; params?: CardQueryModelDto }) {
    return httpGet<CardResponseDto>(`/cards/${id}`, config)
  }

  static updateCardDates(id: string, data: { updateCardDatesDto: UpdateCardDatesDto }) {
    const updateCardDatesDto = AxiosContracts.requestContract(UpdateCardDatesDtoSchema, data.updateCardDatesDto)
    return httpPut<CardResponseDto>(`/cards/${id}/dates`, updateCardDatesDto)
  }
}
