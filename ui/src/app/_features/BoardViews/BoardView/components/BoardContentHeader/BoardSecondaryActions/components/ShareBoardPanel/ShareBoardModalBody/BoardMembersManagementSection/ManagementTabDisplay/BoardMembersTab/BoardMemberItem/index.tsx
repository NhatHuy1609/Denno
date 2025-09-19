import React from 'react'
import type { userSchemas } from '@/entities/user'
import type { boardSchemas } from '@/entities/board'
import Avatar from '@/ui/components/Avatar'
import DropdownMenuPrimary, { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { useBoardAssignMemberRole } from '../hooks/useBoardAssignMemberRole'
import { useAssignableBoardRoles } from '../hooks/useAssignableBoardRoles'
import DropdownOtherActions from './DropdownOtherActions'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import useUpdateBoardMemberRole from '@/app/_hooks/mutation/board/useUpdateBoardMemberRole'
import { WorkspaceParticipant } from '../hooks/useWorkspaceMembersWithGuests'

interface BoardMemberItemProps {
  member: userSchemas.User
  memberRole: string
  workspaceParticipantType?: WorkspaceParticipant['participantType']
}

function BoardMemberItem({ member, memberRole, workspaceParticipantType }: BoardMemberItemProps) {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')

  const { mutateAsync: updateBoardMemberRoleAsync } = useUpdateBoardMemberRole({
    onSuccess: () => {}
  })

  // Get dynamic assignable roles for the target member
  // This will return the roles that the current user can assign to the target member
  const { roles: assignableRoles } = useAssignableBoardRoles({
    targetMemberId: member.id
  })

  const {
    canAssign: canAssignMemberRole,
    workspaceOwnerId,
    currentAssigner
  } = useBoardAssignMemberRole({
    targetMemberId: member.id,
    targetMemberRole: memberRole as boardSchemas.BoardMemberRole
  })

  // Decide if the current user can select the dropdown
  const isRoleDropdownDisabled = () => {
    const memberIsCurrentAssigner = currentAssigner?.id === member.id
    const memberIsWorkspaceOwner = member.id === workspaceOwnerId
    const currentUserIsWorkspaceOwner = currentAssigner?.id === workspaceOwnerId

    // If the member is both the workspace owner and the one assigning roles,
    // allow them to change their own role (dropdown enabled)
    if (currentUserIsWorkspaceOwner) {
      return false
    }

    // If the member is the workspace owner but not the assigner,
    // prevent role changes (dropdown disabled)
    if (memberIsWorkspaceOwner) {
      return true
    }

    if (memberIsCurrentAssigner) {
      return false
    }

    // Disable dropdown if current user can't assign role
    // or if the target member is not allowed to leave the board
    return !canAssignMemberRole
  }

  const handleUpdateBoardMemberRole = async (newRole: DropdownMenuPrimaryItemProps<boardSchemas.BoardMemberRole>) => {
    if (!boardId) return

    await updateBoardMemberRoleAsync({
      boardId,
      memberId: member.id,
      updateBoardMemberRoleRequestDto: {
        memberRole: newRole.value
      }
    })
  }

  const displayWorkspaceParticipantType = (type: WorkspaceParticipant['participantType']): string => {
    switch (type) {
      case 'normal':
        return 'Workspace member'
      case 'guest':
        return 'Workspace guest'
      case 'admin':
        return 'Workspace admin'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className='flex w-full items-center justify-between gap-3'>
      <Avatar src={member.avatar} size='base' name={member.fullName} />
      <div className='flex flex-1 flex-col justify-between'>
        <span className='text-base text-gray-600'>{member.fullName}</span>
        <div className='flex gap-2 text-xs text-gray-500'>
          <span>{member.email}</span>
          {workspaceParticipantType && <span>{displayWorkspaceParticipantType(workspaceParticipantType)}</span>}
        </div>
      </div>
      <DropdownMenuPrimary
        items={assignableRoles}
        triggerTitle={assignableRoles.find((role) => role.value === memberRole)?.label}
        defaultSelectedIndex={assignableRoles.findIndex((role) => role.value === memberRole)}
        renderOtherItems={() => <DropdownOtherActions boardId={boardId} memberId={member.id} />}
        disabled={isRoleDropdownDisabled()}
        onSelect={handleUpdateBoardMemberRole}
        contentClassName='min-w-[290px]'
      />
    </div>
  )
}

export default BoardMemberItem
