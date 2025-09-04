import { z } from 'zod'
import {
  CreateBoardDtoSchema,
  BoardResponseDtoSchema,
  BoardsResponseDtoSchema,
  AddBoardMemberDtoSchema,
  BoardInvitationSecretResponseDtoSchema,
  CreateBoardInvitationSecretDtoSchema,
  VerifyBoardInvitationSecretRequestDtoSchema,
  DetailedBoardInvitationSecretResponseDtoSchema,
  BoardJoinRequestResponseDtoSchema,
  BoardJoinRequestsResponseDtoSchema,
  CreateBoardJoinRequestDtoSchema,
  ApproveBoardJoinRequestDtoSchema,
  UpdateBoardMemberRoleRequestDtoSchema,
  UpdateBoardRequestDtoSchema
} from './board.contracts'

export type CreateBoardDto = z.infer<typeof CreateBoardDtoSchema>
export type BoardResponseDto = z.infer<typeof BoardResponseDtoSchema>
export type BoardsResponseDto = z.infer<typeof BoardsResponseDtoSchema>
export type AddBoardMemberDto = z.infer<typeof AddBoardMemberDtoSchema>
export type CreateBoardInvitationSecretDto = z.infer<typeof CreateBoardInvitationSecretDtoSchema>
export type BoardInvitationSecretResponseDto = z.infer<typeof BoardInvitationSecretResponseDtoSchema>
export type VerifyBoardInvitationSecretRequestDto = z.infer<typeof VerifyBoardInvitationSecretRequestDtoSchema>
export type DetailedBoardInvitationSecretResponseDto = z.infer<typeof DetailedBoardInvitationSecretResponseDtoSchema>
export type BoardJoinRequestResponseDto = z.infer<typeof BoardJoinRequestResponseDtoSchema>
export type BoardJoinRequestsResponseDto = z.infer<typeof BoardJoinRequestsResponseDtoSchema>
export type CreateBoardJoinRequestDto = z.infer<typeof CreateBoardJoinRequestDtoSchema>
export type ApproveBoardJoinRequestDto = z.infer<typeof ApproveBoardJoinRequestDtoSchema>
export type UpdateBoardMemberRoleRequestDto = z.infer<typeof UpdateBoardMemberRoleRequestDtoSchema>
export type UpdateBoardRequestDto = z.infer<typeof UpdateBoardRequestDtoSchema>
