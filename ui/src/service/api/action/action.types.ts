import { z } from 'zod'

import { 
  AddWorkspaceMemberActionResponseDtoSchema,
  JoinWorkspaceByLinkActionResponseDtoSchema
} from './action.contracts'

export type AddWorkspaceMemberActionResponseDto = z.infer<typeof AddWorkspaceMemberActionResponseDtoSchema>
export type JoinWorkspaceByLinkActionResponseDto = z.infer<typeof JoinWorkspaceByLinkActionResponseDtoSchema>