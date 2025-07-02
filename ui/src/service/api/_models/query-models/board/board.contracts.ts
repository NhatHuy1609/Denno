import { z }  from 'zod'

export const BoardQueryOptionsDto = z.object({
  includeBoardMembers: z.coerce.boolean().default(false).optional(),
  includeCardLists: z.coerce.boolean().default(false).optional(),
  includeBoardLabels: z.coerce.boolean().default(false).optional(),
  includeBoardRestrictions: z.coerce.boolean().default(false).optional(),
  includeActions: z.coerce.boolean().default(false).optional(),
  includeJoinRequests: z.coerce.boolean().default(false).optional(),
  includeBoardUserSettings: z.coerce.boolean().default(false).optional(),
  includeWorkspace: z.coerce.boolean().default(false).optional(),
});