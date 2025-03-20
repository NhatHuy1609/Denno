import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import { userTypes } from '@/entities/user'
import { Avatar } from '@/ui'
import React, { useRef } from 'react'

interface SearchedUsersResultProps {
  searchedUserData: userTypes.Users
  selectUserFn: (user: userTypes.User) => void
  hideSearchedUsersResultFn: () => void
}

export default function SearchedUsersResult({
  searchedUserData,
  selectUserFn,
  hideSearchedUsersResultFn
}: SearchedUsersResultProps) {
  const { users } = searchedUserData

  const containerRef = useRef<HTMLDivElement>(null)

  useOnClickOutSide(containerRef, () => {
    hideSearchedUsersResultFn && hideSearchedUsersResultFn()
  })

  return (
    <div ref={containerRef} className='absolute mt-1 w-full rounded-sm bg-white p-2 shadow-md'>
      <SearchedUsersList users={searchedUserData}>
        {users.map((user) => (
          <SearchedUsersList.Item
            user={user}
            key={user.id}
            selectUserFn={selectUserFn}
            hideSearchedUsersResultFn={hideSearchedUsersResultFn}
          />
        ))}
      </SearchedUsersList>
    </div>
  )
}

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
  selectUserFn: SearchedUsersResultProps['selectUserFn']
  hideSearchedUsersResultFn: SearchedUsersResultProps['hideSearchedUsersResultFn']
}

function SearchedUserItem({
  user,
  selectUserFn,
  hideSearchedUsersResultFn
}: SearchedUserItemProps) {
  const { email, avatar } = user

  const handleSelectUser = () => {
    selectUserFn && selectUserFn(user)
    hideSearchedUsersResultFn && hideSearchedUsersResultFn()
  }

  return (
    <li
      onClick={handleSelectUser}
      className='flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-300'
    >
      <Avatar src={avatar} name='user-avatar' />
      <span className='text-sm'>{email}</span>
    </li>
  )
}
