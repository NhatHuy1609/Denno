import { z } from 'zod'

// Requests

export const WorkspaceMembersResponseDtoSchema = z.object({
  workspaceId: z.string(),
}).describe('WorkspaceMembersResponseDtoSchema')