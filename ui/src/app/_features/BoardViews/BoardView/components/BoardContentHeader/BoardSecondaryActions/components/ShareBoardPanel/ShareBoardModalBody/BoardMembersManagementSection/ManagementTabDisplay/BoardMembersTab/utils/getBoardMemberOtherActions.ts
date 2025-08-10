import { PolicyContext } from "@/permissions/types/policy-context"
import { evaluateDynamicDropdownItems } from "@/permissions/utils/evaluate-dynamic-dropdown"

type BaseActionDefinition = {
  actionType: 'RemoveMember' | 'LeaveBoard'
  label: string
}

type DynamicProperties = {
  available: boolean
  description?: string
}

const baseActions: Array<BaseActionDefinition> = [
  {
    actionType: 'RemoveMember',
    label: 'Remove from board',
  },
  {
    actionType: 'LeaveBoard',
    label: 'Leave board',
  }
]

export function getBoardMemberOtherActions() {
  return baseActions
}