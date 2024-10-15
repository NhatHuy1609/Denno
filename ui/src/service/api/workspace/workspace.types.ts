import { z } from 'zod'
import { CreateWorkspaceDtoSchema } from './workspace.contracts'

export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceDtoSchema>