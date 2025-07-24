import { z } from 'zod'
import { enumContracts } from '../_enums'
import { userContracts } from '@/entities/user'
import { userContractsDto } from '../user'

const BoardDto = z.object({
  id: z.string(),
  name: z.string(),
  background: z.string(),
  starredStatus: z.boolean(),
  workspaceId: z.string(),
  visibility: enumContracts.BoardVisibilityEnumSchema,
  
  members: z.array(z.object({
    memberId: z.string(),
    member: userContracts.UserSchema,
    boardMemberRole: enumContracts.BoardMemberRoleEnumSchema
  })),
  joinRequests: z.array(z.object({
    id: z.number().int(),
    boardId: z.string(),
    requestedAt: z.string(),
    requester: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string()
    })
  })),
  workspace: z.object({
    id: z.string().uuid(),
    ownerId: z.string(),
    name: z.string(),
    description: z.string(),
    logoUrl: z.string().optional(),
    visibility: enumContracts.WorkspaceVisibilityEnumSchema
  })
})

// Request
export const CreateBoardDtoSchema = z.object({
  name: z.string().min(1),
  workspaceId: z.string(),
  background: z.string(),
  visibility: z.string()
}).describe("CreateBoardDtoSchema")

export const AddBoardMemberDtoSchema = z.object({
  email: z.string().email(),
  description: z.string(),
  role: enumContracts.BoardMemberRoleEnumSchema
}).describe("AddBoardMemberDtoSchema")

export const CreateBoardInvitationSecretDtoSchema = z.object({
  boardRole: enumContracts.BoardMemberRoleEnumSchema
}).describe('CreateBoardInvitationSecretDtoSchema')

export const VerifyBoardInvitationSecretRequestDtoSchema = z.object({
  secretCode: z.string()
}).describe("VerifyBoardInvitationSecretRequestDtoSchema")

export const CreateBoardJoinRequestDtoSchema = z.object({
  requesterId: z.string()
}).describe("CreateBoardJoinRequestDtoSchema")

export const ApproveBoardJoinRequestDtoSchema = z.object({
  memberRole: enumContracts.BoardMemberRoleEnumSchema
}).describe("ApproveBoardJoinRequestDtoSchema")

// Response
export const BoardResponseDtoSchema = BoardDto.describe("BoardResponseDtoSchema")

export const BoardsResponseDtoSchema = z.array(BoardDto).describe("BoardsResponseDtoSchema")

export const BoardInvitationSecretResponseDtoSchema = z.object({
  secretCode: z.string()
}).describe("BoardInvitationSecretResponseDtoSchema")

export const BoardJoinRequestResponseDtoSchema = z.object({
  id: z.number(),
  boardId: z.string(),
  requestedAt: z.string().datetime(),
  requester: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string()
  })
}).describe('BoardJoinRequestResponseDtoSchema')

export const BoardJoinRequestsResponseDtoSchema = z.array(BoardJoinRequestResponseDtoSchema).describe('BoardJoinRequestsResponseDtoSchema')

export const DetailedBoardInvitationSecretResponseDtoSchema = z.object({
  inviter: userContractsDto.GetUserResponseDtoSchema,
  board: BoardResponseDtoSchema
}).describe('DetailedBoardInvitationSecretResponseDtoSchema')
