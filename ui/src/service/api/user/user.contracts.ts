import { z } from 'zod'
import { createPaginatedResultSchema } from '../_models/pagination'
import { boardContractsDto } from '../board'
import { BoardResponseDtoSchema } from '../board/board.contracts'

// Response Schemas
export const GetUserResponseDtoSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    avatar: z.string(),
    fullName: z.string(),
    userName: z.string().nullable(),
    jobTitle: z.string().nullable(),
    department: z.string().nullable(),
    basedIn: z.string().nullable(),
    organization: z.string().nullable(),
    coverImage: z.string().nullable(),
    userVisibilitySettings: z
      .object({
        id: z.string().nullable(),
        fullNameVisibility: z.string(),
        jobTitleVisibility: z.string(),
        departmentVisibility: z.string(),
        organizationVisibility: z.string(),
        basedInVisibility: z.string(),
        emailVisibility: z.string(),
        avatarVisibility: z.string()
      })
      .nullable()
  })
  .describe('GetUserResponseDtoSchema')

export const UsersResponseDtoSchema =
  createPaginatedResultSchema(GetUserResponseDtoSchema).describe('UsersResponseDtoSchema')

export const UserWorkspacesResponseDtoSchema = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
      logo: z.string().nullable()
    })
  )
  .describe('UserWorkspacesResponseDtoSchema')

export const UserBoardsResponseDtoSchema = z.object({
  boards: z.array(z.lazy(() => boardContractsDto.BoardResponseDtoSchema)),
  starredBoards: z.array(z.lazy(() => boardContractsDto.BoardResponseDtoSchema))
})
