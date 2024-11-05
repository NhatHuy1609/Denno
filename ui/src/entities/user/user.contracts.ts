import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().nullable(),
  email: z.string(),
  avatar: z.string(),
  fullName: z.string(),
  userName: z.string(),
  jobTitle: z.string(),
  department: z.string(),
  basedIn: z.string(),
  organization: z.string(),
  coverImage: z.string(),
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