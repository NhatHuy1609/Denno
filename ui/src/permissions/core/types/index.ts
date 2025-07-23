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

export type PolicyResource = 
  | 'user'
  | 'workspace'
  | 'board'
  | 'card'

export type PolicyContext = {
  user: userTypes.User
  [key: string]: any
}

export type PolicyResult = {
  allowed: boolean
  reason?: PolicyReason
}

export interface IPolicy<T = any> {
  evaluate(context: PolicyContext, resource?: T): PolicyResult
}

export type PolicyKey = `${PolicyAction}:${PolicyResource}`