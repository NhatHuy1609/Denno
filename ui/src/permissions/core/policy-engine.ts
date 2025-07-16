import { 
  PolicyAction, 
  PolicyResource, 
  PolicyContext, 
  PolicyResult,
  PolicyKey,
  IPolicy 
} from './types'
import { PolicyRegistry } from './policy-registry'

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
        reason: `No policy found for ${policyKey}`
      }
    }

    return policy.evaluate(context, resourceData)
  }
}