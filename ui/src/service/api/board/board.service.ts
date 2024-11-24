import { httpPost, httpGet } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { CreateBoardDto } from './board.types'
import { CreateBoardDtoSchema } from './board.contracts'
import { boardContractsDto } from '.'

export class BoardService {
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

  static boardQuery(boardId: string) {
    return httpGet(`/boards/${boardId}`)
            .then(AxiosContracts.responseContract(boardContractsDto.BoardResponseDtoSchema))
  }
}