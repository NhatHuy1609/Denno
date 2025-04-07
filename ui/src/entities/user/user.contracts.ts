import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  avatar: z.string(),
  fullName: z.string(),
  userName: z.string().nullable(),
  jobTitle: z.string().nullable(),
  department: z.string().nullable(),
  basedIn: z.string().nullable(),
  organization: z.string().nullable(),
  coverImage: z.string().nullable(),
  userVisibilitySettings: z.object({
    id: z.string().nullable(),
    fullNameVisibility: z.string(),
    jobTitleVisibility: z.string(),
    departmentVisibility: z.string(),
    organizationVisibility: z.string(),
    basedInVisibility: z.string(),
    emailVisibility: z.string(),
    avatarVisibility: z.string(),
  }).nullable()
});

export const UsersSchema = z.object({
  users: z.array(UserSchema),
  pageSize: z.number().int().positive(),
  pageNumber: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
})

export const UserWorkspacesSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().nullable(),
}))

export const UsersFilterQuerySchema = z.object({
  name: z.string(),
  email: z.string(),
  pageSize: z.number().int().positive(),
  pageNumber: z.number().int().positive()
}).partial().describe("UsersFilterQuerySchema")

export const UserWorkspacesFilterQuerySchema = z.object({
  filter: z.enum(["none", "members", "public", "all"]),
  fields: z.array(z.enum(["id", "name", "logo"])).default(["id", "name", "logo"])
}).describe("UserWorkspacesFilterQuerySchema")
