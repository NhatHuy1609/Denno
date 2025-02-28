import { z } from 'zod'

export const BoardVisibilityEnumSchema = z.enum(['Private', 'Workspace', 'Public'])