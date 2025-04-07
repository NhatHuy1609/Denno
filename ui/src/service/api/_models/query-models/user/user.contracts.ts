import { z } from 'zod'

// Query Models Schema
export const UsersQueryParamsDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  pageSize: z.number().int().positive(),
  pageNumber: z.number().int().positive()
}).partial().describe("UsersQueryParamsDtoSchema")

export const UserWorkspacesQueryDtoSchema = z.object({
  filter: z.enum(["none", "members", "public", "all"]),
  fields: z.array(z.enum(["id", "name", "logo"])).default(["id", "name", "logo"])
}).describe("UserWorkspacesQueryDtoSchema")