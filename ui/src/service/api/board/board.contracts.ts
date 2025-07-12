import { z } from 'zod'
import { enumContracts } from '../_enums'
import { userContracts } from '@/entities/user'

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
    boardMemberRole: z.string()
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
  }))
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