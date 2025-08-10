import { useMe } from '@/app/_hooks/query/user/useMe'
import { PolicyEngine } from '../core/policy-engine'
import { PolicyAction } from '../types/policy-actions'
import { PolicyResource } from '../types/policy-resources'
import { PolicyContext } from '../types/policy-context'

export const usePermissions = () => {
  const { data: currentUser } = useMe()

  const policyEngine = new PolicyEngine()

  const can = <T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    resourceData?: T,
    additionalContext?: Partial<PolicyContext>
  ): boolean => {
    const context: PolicyContext = {
      user: currentUser!,
      ...additionalContext
    }

    return policyEngine.can(action, resource, context, resourceData)
  }

  const cannot = <T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    resourceData?: T,
    additionalContext?: Partial<PolicyContext>
  ): boolean => {
    return !can(action, resource, resourceData, additionalContext)
  }

  const canWithReason = <T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    resourceData?: T,
    additionalContext?: Partial<PolicyContext>
  ) => {
    const context: PolicyContext = {
      user: currentUser!,
      ...additionalContext
    }

    return policyEngine.canWithReason(action, resource, context, resourceData)
  }

  return { can, cannot, canWithReason }
}
