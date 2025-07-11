import { z } from 'zod'
import { 
  CreateBoardDtoSchema,
  BoardResponseDtoSchema,
  BoardsResponseDtoSchema,
  AddBoardMemberDtoSchema,
  BoardInvitationSecretResponseDtoSchema,
  CreateBoardInvitationSecretDtoSchema
} from './board.contracts'

export type CreateBoardDto = z.infer<typeof CreateBoardDtoSchema>
export type BoardResponseDto = z.infer<typeof BoardResponseDtoSchema>
export type BoardsResponseDto = z.infer<typeof BoardsResponseDtoSchema>
export type AddBoardMemberDto = z.infer<typeof AddBoardMemberDtoSchema>
export type CreateBoardInvitationSecretDto = z.infer<typeof CreateBoardInvitationSecretDtoSchema>
export type BoardInvitationSecretResponseDto = z.infer<typeof BoardInvitationSecretResponseDtoSchema>