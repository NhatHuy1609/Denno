import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpGet, httpPost, httpPut } from "../_req";
import { CardsByCardListResponseDto, CreateCardDto, CreateCardResponseDto, UpdateCardRankDto, UpdateCardRankResponseDto } from "./card.types";
import { CreateCardDtoSchema, UpdateCardRankDtoSchema } from "./card.contracts";

export class CardService {
  static cardsByCardListQuery(data: { cardListId: string }, config: { signal?: AbortSignal }) {
    const { cardListId } = data

    return httpGet<CardsByCardListResponseDto>(`/cardLists/${cardListId}/cards`)
  }

  static createCardMutation(data: { createCardDto: CreateCardDto }) {
    const createCardDto = AxiosContracts.requestContract(
      CreateCardDtoSchema,
      data.createCardDto
    )

    return httpPost<CreateCardResponseDto>('/cards', createCardDto)
  }

  static updateCardRankMutation(data: { id: string, updateCardRankDto: UpdateCardRankDto }) {
    const updateCardRankDto = AxiosContracts.requestContract(
      UpdateCardRankDtoSchema,
      data.updateCardRankDto
    )

    return httpPut<UpdateCardRankResponseDto>(`/cards/${data.id}/rank`, updateCardRankDto)
  }
}