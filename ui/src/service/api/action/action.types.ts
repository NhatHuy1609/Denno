import { z } from 'zod'

import { 
  ActionDtoSchema,
  AddWorkspaceMemberActionResponseDtoSchema,
  JoinWorkspaceByLinkActionResponseDtoSchema
} from './action.contracts'

export type ActionResponseDto = z.infer<typeof ActionDtoSchema>
export type AddWorkspaceMemberActionResponseDto = z.infer<typeof AddWorkspaceMemberActionResponseDtoSchema>
export type JoinWorkspaceByLinkActionResponseDto = z.infer<typeof JoinWorkspaceByLinkActionResponseDtoSchema>