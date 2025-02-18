import { httpPost, httpGet } from "../_req";
import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { CreateCardListDtoSchema } from "./cardList.contracts";
import { CardListResponseDto, CardListsByBoardResponseDto, CreateCardListDto } from "./cardList.types";

export class CardListService {
  static cardListsByBoardQuery(data: { boardId: string }, config: { signal?: AbortSignal }) {
    const { boardId } = data

    return httpGet<CardListsByBoardResponseDto>(`/boards/${boardId}/cardLists`)
  }

  static createCardListMutation(data: { createCardListDto: CreateCardListDto }) {
    const createCardListDto = AxiosContracts.requestContract(
      CreateCardListDtoSchema,
      data.createCardListDto
    )

    return httpPost<CardListResponseDto>('/cardLists', createCardListDto)
  }
}