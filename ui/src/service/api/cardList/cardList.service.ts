import { httpPost, httpGet, httpPut } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { CreateCardListDtoSchema, UpdateCardListDtoSchema, UpdateCardListRankDtoSchema } from './cardList.contracts'
import {
  CardListResponseDto,
  CardListsByBoardResponseDto,
  CreateCardListDto,
  UpdateCardListDto,
  UpdateCardListRankDto
} from './cardList.types'

export class CardListService {
  static cardListsByBoardQuery(data: { boardId: string }, config?: { signal?: AbortSignal }) {
    const { boardId } = data

    return httpGet<CardListsByBoardResponseDto>(`/boards/${boardId}/cardLists`, config)
  }

  static createCardListMutation(data: { createCardListDto: CreateCardListDto }) {
    const createCardListDto = AxiosContracts.requestContract(CreateCardListDtoSchema, data.createCardListDto)

    return httpPost<CardListResponseDto>('/cardLists', createCardListDto)
  }

  static updateCardListMutation(data: { id: string; updateCardListDto: UpdateCardListDto }) {
    const updateCardListDto = AxiosContracts.requestContract(UpdateCardListDtoSchema, data.updateCardListDto)

    return httpPut<CardListResponseDto>(`/cardLists/${data.id}`, updateCardListDto)
  }

  static updateCardListRankMutation(data: { id: string; updateCardListRankDto: UpdateCardListRankDto }) {
    const updateCardListRankDto = AxiosContracts.requestContract(
      UpdateCardListRankDtoSchema,
      data.updateCardListRankDto
    )

    return httpPut<CardListResponseDto>(`/cardLists/${data.id}/rank`, updateCardListRankDto)
  }

  static getCardList(id: string, config?: { signal?: AbortSignal }) {
    return httpGet<CardListResponseDto>(`/cardLists/${id}`, config)
  }
}
