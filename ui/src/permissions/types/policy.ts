import { PolicyAction } from "./policy-actions"
import { PolicyContext } from "./policy-context"
import { PolicyResource } from "./policy-resources"
import { PolicyResult } from "./policy-result"

// context: includes info about the actor performing the action (e.g. user, environment)
// resource: represents the target entity being acted upon (e.g. board, card, member)
export interface IPolicy<T = any> {
  evaluate(context: PolicyContext, resource?: T): PolicyResult
}

export type PolicyKey = `${PolicyResource}:${PolicyAction}`