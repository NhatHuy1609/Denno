import { PolicyContext } from '@/permissions/types/policy-context'
import { BasePolicy } from '../base-policy'
import { PolicyResult } from '@/permissions/types/policy-result'

export abstract class WorkspaceBasePolicy extends BasePolicy<any> {
  abstract evaluate(context: PolicyContext, resource?: any): PolicyResult
}
