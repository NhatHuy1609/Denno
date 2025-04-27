import { z }  from 'zod'
import { WorkspaceQuerySchema } from './workspace.contracts'

export type WorkspaceQueryParamsDto = z.infer<typeof WorkspaceQuerySchema>;