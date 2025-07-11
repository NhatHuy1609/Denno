import { httpPost, httpGet, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { AddBoardMemberDto, BoardInvitationSecretResponseDto, CreateBoardDto, CreateBoardInvitationSecretDto } from './board.types'
import { AddBoardMemberDtoSchema, CreateBoardDtoSchema, CreateBoardInvitationSecretDtoSchema } from './board.contracts'
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
      AddBoardMemberDtoSchema,
      data.addBoardMemberDto)

    return httpPost<actionTypesDto.ActionResponseDto>(`${this.basePath}/${data.boardId}/members`, addBoardMemberDto)
  }

  static boardInvitationSecretQuery(boardId: string) {
    return httpGet<BoardInvitationSecretResponseDto>(`${this.basePath}/${boardId}/invitationSecret`)
  }

  static createBoardInvitationSecret(data: { boardId: string, createBoardInvitationSecretDto: CreateBoardInvitationSecretDto }) {
    const createBoardInvitationSecretDto = AxiosContracts.requestContract(
      CreateBoardInvitationSecretDtoSchema,
      data.createBoardInvitationSecretDto
    )

    return httpPost<BoardInvitationSecretResponseDto>(
      `${this.basePath}/${data.boardId}/invitationSecret`, 
      createBoardInvitationSecretDto
    )
  }

  static deleteBoardInvitationSecret(boardId: string) {
    return httpDel(`${this.basePath}/${boardId}/invitationSecret`,)
  }
}