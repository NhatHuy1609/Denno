import { useWorkspaceQuery } from '@/app/_hooks/query'

export type WorkspaceParticipant = {
  id: string
  name: string
  email: string
  avatarUrl: string
  participantType: 'normal' | 'guest' | 'admin'
}

type UseWorkspaceMembersWithGuestsResult = {
  workspaceParticipants: WorkspaceParticipant[]
  participantTypeMapById: Map<string, WorkspaceParticipant['participantType']>
}

export const useWorkspaceMembersWithGuests = (workspaceId: string): UseWorkspaceMembersWithGuestsResult => {
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, {
    includeGuests: true,
    members: true
  })

  const { members: workspaceMembers = [], guests: workspaceGuests = [] } = workspaceData || {}

  const participantTypeMap: Record<string, WorkspaceParticipant['participantType']> = {
    Admin: 'admin',
    Normal: 'normal',
    Guest: 'guest'
  }

  const participants = [
    ...workspaceMembers.map(({ id, fullName, avatar, email, memberType }) => ({
      id,
      name: fullName,
      avatarUrl: avatar,
      email,
      participantType: participantTypeMap[memberType]
    })),
    ...workspaceGuests.map(({ user }) => ({
      id: user.id,
      name: user.fullName,
      avatarUrl: user.avatar,
      email: user.email,
      participantType: participantTypeMap.Guest
    }))
  ]

  const participantTypeMapById = new Map<string, WorkspaceParticipant['participantType']>(
    participants.map((p) => [p.id, p.participantType])
  )

  return {
    workspaceParticipants: participants,
    participantTypeMapById
  }
}
