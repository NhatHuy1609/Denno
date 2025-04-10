import React, { useRef } from 'react'
import { cn } from '@/lib/styles/utils'
import { userTypes } from '@/entities/user'
import { useParams } from 'next/navigation'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import { Avatar } from '@/ui'

interface SearchedUsersResultProps {
  searchedUserData: userTypes.Users
  selectUserFn: (user: userTypes.User) => void
  hideSearchedUsersResultFn: () => void
}

function SearchedUsersResult({
  searchedUserData,
  selectUserFn,
  hideSearchedUsersResultFn
}: SearchedUsersResultProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { workspaceId } = useParams<{ workspaceId: string }>()

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
  const handleSelectUser = (user: userTypes.User) => {
    const isAlreadyMember = members.some((member) => member.id === user.id)

    if (isAlreadyMember) {
      return
    }

    selectUserFn && selectUserFn(user)
  }

  const renderSearchedUsersList = () => {
    return (
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
    )
  }

  return (
    <div ref={containerRef} className='absolute mt-1 w-full rounded-sm bg-white p-2 shadow-md'>
      {renderSearchedUsersList()}
    </div>
  )
}

export default React.memo(SearchedUsersResult)

interface SearchedUsersListProps {
  users: userTypes.Users
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
  user: userTypes.User
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
      className={cn('flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-300', {
        'cursor-not-allowed opacity-70': isAlreadyMember
      })}
    >
      <Avatar src={avatar} name='user-avatar' />
      <div className='flex w-full flex-col gap-1'>
        <span className='text-sm'>{email}</span>
        {memberRole && <span className='text-[12px] text-black/90'>{memberRoleText}</span>}
      </div>
    </li>
  )
}
