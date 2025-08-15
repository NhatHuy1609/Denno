import { PolicyEngine } from "../core/policy-engine"
import { PolicyAction } from "../types/policy-actions"
import { PolicyContext } from "../types/policy-context"
import { PolicyResource } from "../types/policy-resources"
import { PolicyResult } from "../types/policy-result"

export function evaluateDynamicDropdownItems<TBase, TDynamic = {}>(
  items: TBase[],
  propertyEvaluators: Array<{
    propertyName: keyof TDynamic
    action: PolicyAction,
    resource: PolicyResource,
    mapItemToPolicyContext: (item: TBase, context: PolicyContext, resourceData?: any) => any,
    mapPolicyResult?: (result: PolicyResult) => any
  }>,
  context: PolicyContext,
  resourceData?: any
): (TBase & TDynamic)[] {
  const policyEngine = new PolicyEngine()

  return items.map(item => {
    const dynamicProperties = {} as TDynamic

    // Evaluate each dynamic property using its specific policy
    propertyEvaluators.forEach(evaluator => {
      if (!evaluator.mapItemToPolicyContext) {
        throw new Error(`Missing mapItemToPolicyResource for property ${String(evaluator.propertyName)}`)
      }

      const itemContextData = evaluator.mapItemToPolicyContext(item, context, resourceData)

      const result = policyEngine.canWithReason(
        evaluator.action,
        evaluator.resource,
        itemContextData,
        resourceData
      )

      // Map policy result to property value
      const propertyValue = evaluator.mapPolicyResult
        ? evaluator.mapPolicyResult(result)
        : result.allowed

      dynamicProperties[evaluator.propertyName] = propertyValue
    })

    return {
      ...item,
      ...dynamicProperties
    } as TBase & TDynamic
  })
}