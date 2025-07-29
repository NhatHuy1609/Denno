import { useMe } from "@/app/_hooks/query/user/useMe"
import { PolicyEngine } from "../core/policy-engine"
import { PolicyAction, PolicyContext, PolicyResource } from "../types"

export const usePermissions = () => {
  const {data: currentUser } = useMe()

  const policyEngine = new PolicyEngine()

  const can = <T = any>(
    action: PolicyAction,
    resource: PolicyResource,
    resourceData?: T
  ): boolean => {
    const context: PolicyContext = {
      user: currentUser!,
    }

    return policyEngine.can(action, resource, context, resourceData)
  }
  
  const cannot = <T = any>(
    action: PolicyAction, 
    resource: PolicyResource, 
    resourceData?: T
  ): boolean => {
    return !can(action, resource, resourceData);
  };
  
  const canWithReason = <T = any>(
    action: PolicyAction, 
    resource: PolicyResource, 
    resourceData?: T
  ) => {
    const context: PolicyContext = {
      user: currentUser!,
    };
    
    return policyEngine.canWithReason(action, resource, context, resourceData);
  };

  return { can, cannot, canWithReason }
}