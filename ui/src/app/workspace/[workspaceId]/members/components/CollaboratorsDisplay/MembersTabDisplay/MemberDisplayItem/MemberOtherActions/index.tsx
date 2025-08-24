import React, { useEffect, useMemo, useState } from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaXmark } from 'react-icons/fa6'
import PopoverAction from '../PopoverAction'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import LeaveWorkspaceAction from './LeaveWorkspaceAction'
import RemoveMemberAction from './RemoveMemberAction'
import { useRemoveWorkspaceMemberPolicy } from './RemoveMemberAction/useRemoveWorkspaceMemberPolicy'

type ActionType = 'remove' | 'leave'

type MemberOtherActionsProps = {
  memberId: string
}

function MemberOtherActions({ memberId }: MemberOtherActionsProps) {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const [actionType, setActionType] = useState<ActionType>('remove')

  const { evaluateRemoveWorkspaceMemberPolicy } = useRemoveWorkspaceMemberPolicy(memberId)

  useEffect(() => {
    if (currentUserId === memberId) {
      setActionType('leave')
    }
  }, [currentUserId, memberId])

  const triggerLabelMap: Record<ActionType, string> = {
    remove: 'Remove from workspace',
    leave: 'Leave workspace'
  }

  // Memoized policy evaluation
  const policyResult = useMemo(() => {
    if (actionType === 'remove') {
      return evaluateRemoveWorkspaceMemberPolicy()
    }
    if (actionType === 'leave') {
      return {
        allowed: true
      }
    }
    return { allowed: false }
  }, [actionType, evaluateRemoveWorkspaceMemberPolicy])

  // Early return if action not allowed
  if (!policyResult.allowed) {
    return <div className='w-[108px] bg-transparent'></div>
  }

  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value={triggerLabelMap[actionType]}
          className='max-w-[108px] px-2'
          valueClassName='truncate'
          startIcon={<FaXmark className='text-base' />}
        />
      )}
      renderContent={(closePopoverFn) => (
        <>
          {actionType === 'remove' && <RemoveMemberAction />}
          {actionType === 'leave' && <LeaveWorkspaceAction />}
        </>
      )}
      contentClassName='px-0 py-4'
    />
  )
}

export default MemberOtherActions
