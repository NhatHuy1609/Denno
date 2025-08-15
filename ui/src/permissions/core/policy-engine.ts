
import { PolicyRegistry } from './policy-registry'
import { PolicyReasonMessages } from '../result-reasons'
import { PolicyAction } from '../types/policy-actions'
import { PolicyResource } from '../types/policy-resources'
import { PolicyContext } from '../types/policy-context'
import { PolicyResult } from '../types/policy-result'
import { PolicyKey } from '../types/policy'

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
    const policyKey: PolicyKey = `${resource}:${action}`
    const policy = PolicyRegistry.get(policyKey)

    if (!policy) {
      return {
        allowed: false,
        reason: {
          code: 'POLICY::DENIED_NOT_FOUND',
          message: PolicyReasonMessages['POLICY::DENIED_NOT_FOUND']
        }
      }
    }

    return policy.evaluate(context, resourceData)
  }
}