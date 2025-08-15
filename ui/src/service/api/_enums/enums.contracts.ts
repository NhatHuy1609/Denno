import { z } from 'zod'

export const BoardVisibilityEnumSchema = z.enum(['Private', 'Workspace', 'Public'])

export const MemberRoleEnumSchema = z.enum(['Normal', 'Admin'])

export const BoardMemberRoleEnumSchema = z.enum(['Member', 'Admin', 'Observer'])

export const WorkspaceVisibilityEnumSchema = z.enum(['Private', 'Public'])
