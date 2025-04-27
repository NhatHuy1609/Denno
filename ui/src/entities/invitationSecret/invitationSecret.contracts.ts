import { z } from 'zod'

export const InvitationSecretSchema = z.object({
  secretCode: z.string()
}).describe("InvitationSecretSchema")