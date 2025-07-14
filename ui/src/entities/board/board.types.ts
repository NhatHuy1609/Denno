import { z } from 'zod'
import { BoardJoinRequestSchema, BoardJoinRequestsSchema, BoardMemberRoleSchema, BoardQueryFilter, BoardSchema, BoardsSchema, DetailedBoardInvitationSchema } from './board.contracts'

export type Board = z.infer<typeof BoardSchema>
export type Boards = z.infer<typeof BoardsSchema>
export type BoardQueryFilter = z.infer<typeof BoardQueryFilter>
export type BoardMemberRole = z.infer<typeof BoardMemberRoleSchema>
export type DetailedBoardInvitation = z.infer<typeof DetailedBoardInvitationSchema>
export type BoardJoinRequest = z.infer<typeof BoardJoinRequestSchema>
export type BoardJoinRequests = z.infer<typeof BoardJoinRequestsSchema>