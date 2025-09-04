import React, { useRef } from 'react'
import { cn } from '@/lib/styles/utils'
import { userSchemas } from '@/entities/user'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import { Avatar } from '@/ui'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

interface SearchedUsersResultProps {
  searchedUserData: userSchemas.Users
  selectUserFn: (user: userSchemas.User) => void
  hideSearchedUsersResultFn: () => void
}

function SearchedUsersResult({ searchedUserData, selectUserFn, hideSearchedUsersResultFn }: SearchedUsersResultProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  // Fetch workspace data to get it's joined members to filter who can be selected to be added to the workspace
  const { data: workspace } = useWorkspaceQuery(workspaceId, {
    members: true
  })

  const { users } = searchedUserData
  const { members = [] } = workspace || {}

  useOnClickOutSide(containerRef, () => {
    hideSearchedUsersResultFn && hideSearchedUsersResultFn()
  })

  // Handle user selection
  // Check if the user is already a member of the workspace before allowing selection
  const handleSelectUser = (user: userSchemas.User) => {
    const isAlreadyMember = members.some((member) => member.id === user.id)
    if (!isAlreadyMember) {
      selectUserFn && selectUserFn(user)
    }
  }

  return (
    <div ref={containerRef} className='absolute mt-1 w-full rounded-sm bg-white p-2 shadow-md'>
      <SearchedUsersList users={searchedUserData}>
        {users.map((user) => (
          <SearchedUsersList.Item
            user={user}
            key={user.id}
            selectUserFn={handleSelectUser}
            hideSearchedUsersResultFn={hideSearchedUsersResultFn}
            memberRole={members.find((member) => member.id === user.id)?.memberType}
            isAlreadyMember={members.some((member) => member.id === user.id)}
          />
        ))}
      </SearchedUsersList>
    </div>
  )
}

export default React.memo(SearchedUsersResult)

interface SearchedUsersListProps {
  users: userSchemas.Users
  children: React.ReactNode
}

function SearchedUsersList({ users, children }: SearchedUsersListProps) {
  if (users.totalCount <= 0) {
    return <span>Not user found</span>
  }

  return <ul className='rounded-sm'>{children}</ul>
}
SearchedUsersList.Item = SearchedUserItem

interface SearchedUserItemProps {
  user: userSchemas.User
  isAlreadyMember: boolean // Check if the user is already a member of the workspace
  memberRole?: string // Optional prop for member role to be used for display
  selectUserFn: SearchedUsersResultProps['selectUserFn']
  hideSearchedUsersResultFn: SearchedUsersResultProps['hideSearchedUsersResultFn']
}

function SearchedUserItem({
  user,
  selectUserFn,
  memberRole,
  isAlreadyMember,
  hideSearchedUsersResultFn
}: SearchedUserItemProps) {
  const { email, avatar } = user
  const memberRoleText = memberRole === 'Admin' ? 'Workspace admin' : 'Workspace member'

  const handleSelectUser = () => {
    selectUserFn && selectUserFn(user)
    hideSearchedUsersResultFn && hideSearchedUsersResultFn()
  }

  return (
    <li
      onClick={handleSelectUser}
      className={cn('flex items-center gap-2 rounded-sm p-2 hover:bg-gray-300', {
        'cursor-not-allowed opacity-70': isAlreadyMember,
        'cursor-pointer': !isAlreadyMember
      })}
      role='button'
      aria-disabled={isAlreadyMember}
      title={isAlreadyMember ? 'Already a member' : 'Click to add to workspace'}
    >
      <Avatar src={avatar} name='user-avatar' />
      <div className='flex w-full flex-col gap-1'>
        <span className='text-sm'>{email}</span>
        {memberRole && <span className='text-[12px] text-black/90'>{memberRoleText}</span>}
      </div>
    </li>
  )
}
