import { userTypes } from "@/entities/user"
import { PolicyReason } from "./result-reasons"

export type PolicyAction =
  | 'view' // FOR UI
  | 'create'
  | 'read'
  | 'update'
  | 'delete' 
  | 'approve' 
  | 'reject'
  | 'assign_role'

export type PolicyResource = 
  | 'user'
  | 'workspace'
  | 'board'
  | 'card'
  | 'board_member'

export type PolicyContext = {
  user: userTypes.User
  [key: string]: any
}

export type PolicyResult = {
  allowed: boolean
  reason?: PolicyReason
}

// context: includes info about the actor performing the action (e.g. user, environment)
// resource: represents the target entity being acted upon (e.g. board, card, member)
export interface IPolicy<T = any> {
  evaluate(context: PolicyContext, resource?: T): PolicyResult
}

export type PolicyKey = `${PolicyAction}:${PolicyResource}`