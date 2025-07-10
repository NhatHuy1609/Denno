import { httpPost, httpGet } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { AddBoardMemberDto, CreateBoardDto } from './board.types'
import { CreateBoardDtoSchema } from './board.contracts'
import { boardContractsDto, boardTypesDto } from '.'
import { BoardQueryOptionsDto } from '../_models/query-models/board/board.types'
import { actionTypesDto } from '../action'

export class BoardService {
  private static readonly basePath = '/boards'

  static createBoardMutation(data: { createBoardDto: CreateBoardDto }) {
    const createBoardDto = AxiosContracts.requestContract(
      CreateBoardDtoSchema,
      data.createBoardDto)

    return httpPost('/boards', createBoardDto)
  }

  static boardsByWorkspaceIdQuery(workspaceId: string) {
    return httpGet(`/workspaces/${workspaceId}/boards`)
            .then(AxiosContracts.responseContract(boardContractsDto.BoardsResponseDtoSchema))
  }

  static boardQuery(boardId: string, config?: { signal?: AbortSignal, params?: BoardQueryOptionsDto } ) {
    return httpGet<boardTypesDto.BoardResponseDto>(`/boards/${boardId}`, config)
  }

  static addBoardMemberMutation(data: { boardId: string, addBoardMemberDto: AddBoardMemberDto }) {
    const addBoardMemberDto = AxiosContracts.requestContract(
      CreateBoardDtoSchema,
      data.addBoardMemberDto)

    return httpPost<actionTypesDto.ActionResponseDto>(`${this.basePath}/${data.boardId}/members`, addBoardMemberDto)
  }
}