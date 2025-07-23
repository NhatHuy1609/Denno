import { 
  PolicyAction, 
  PolicyResource, 
  PolicyContext, 
  PolicyResult,
  PolicyKey,
} from './types'
import { PolicyRegistry } from './policy-registry'
import { PolicyReasonMessages } from './types/result-reasons'

export class PolicyEngine {
  can<T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    context: PolicyContext,
    resourceData?: T
  ): boolean {
    const result = this.canWithReason(action, resource, context, resourceData)
    return result.allowed
  }

  canWithReason<T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    context: PolicyContext,
    resourceData?: T
  ): PolicyResult {
    const policyKey: PolicyKey = `${action}:${resource}`
    const policy = PolicyRegistry.get(policyKey)

    if (!policy) {
      return {
        allowed: false,
        reason: {
          code: 'POLICY::NOT_FOUND',
          message: PolicyReasonMessages['POLICY::NOT_FOUND']
        }
      }
    }

    return policy.evaluate(context, resourceData)
  }
}