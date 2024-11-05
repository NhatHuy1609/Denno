import { z } from 'zod'

export const GetUserResponseDtoSchema = z.object({
  id: z.string().nullable(),
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