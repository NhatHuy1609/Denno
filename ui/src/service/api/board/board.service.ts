import { httpPost, httpGet, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { AddBoardMemberDto, BoardInvitationSecretResponseDto, BoardJoinRequestResponseDto, BoardJoinRequestsResponseDto, CreateBoardDto, CreateBoardInvitationSecretDto, CreateBoardJoinRequestDto, DetailedBoardInvitationSecretResponseDto, VerifyBoardInvitationSecretRequestDto } from './board.types'
import { AddBoardMemberDtoSchema, CreateBoardDtoSchema, CreateBoardInvitationSecretDtoSchema, CreateBoardJoinRequestDtoSchema, VerifyBoardInvitationSecretRequestDtoSchema } from './board.contracts'
import { boardContractsDto, boardTypesDto } from '.'
import { BoardQueryOptionsDto } from '../_models/query-models/board/board.types'
import { actionTypesDto } from '../action'
import { JoinBoardByLinkActionResponseDto } from '../action/action.types'

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

  static joinBoardByLinkMutation(boardId: string) {
    return httpPost<JoinBoardByLinkActionResponseDto>(
      `${this.basePath}/${boardId}/joinByLink`
    )
  }

  static boardInvitationSecretQuery(boardId: string) {
    return httpGet<BoardInvitationSecretResponseDto>(`${this.basePath}/${boardId}/invitationSecret`)
  }

  static detailedBoardInvitationSecretQuery(boardId: string) {
    return httpGet<DetailedBoardInvitationSecretResponseDto>(`${this.basePath}/${boardId}/invitationSecret/detailed`)
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

  static verifyBoardInvitationSecretMutation(data: { boardId: string, verifyInvitationSecretDto: VerifyBoardInvitationSecretRequestDto }) {
    const verifyInvitationSecretDto = AxiosContracts.requestContract(
      VerifyBoardInvitationSecretRequestDtoSchema,
      data.verifyInvitationSecretDto
    )

    return httpPost(`${this.basePath}/${data.boardId}/invitationSecret/verification`, verifyInvitationSecretDto)
  }

  static boardJoinRequestsQuery(boardId: string) {
    return httpGet<BoardJoinRequestsResponseDto>(`${this.basePath}/${boardId}/joinRequests`)
  }

  static createBoardJoinRequestMutation(boardId: string, data: { createBoardJoinRequestDto: CreateBoardJoinRequestDto }) {
    const createBoardJoinRequestDto = AxiosContracts.requestContract(
      CreateBoardJoinRequestDtoSchema,
      data.createBoardJoinRequestDto
    )

    return httpPost<BoardJoinRequestResponseDto>(
      `${this.basePath}/${boardId}/joinRequests`,
      createBoardJoinRequestDto
    )
  }
}