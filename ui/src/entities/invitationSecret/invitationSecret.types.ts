import { z } from 'zod'
import { InvitationSecretSchema } from '@/entities/invitationSecret/invitationSecret.contracts'

export type InvitationSecret = z.infer<typeof InvitationSecretSchema>