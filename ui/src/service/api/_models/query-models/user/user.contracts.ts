import { z } from 'zod'

// Query Models Schema
export const UsersQueryParamsDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  pageSize: z.number().int().positive(),
  pageNumber: z.number().int().positive()
}).partial().describe("UsersQueryParamsDtoSchema")