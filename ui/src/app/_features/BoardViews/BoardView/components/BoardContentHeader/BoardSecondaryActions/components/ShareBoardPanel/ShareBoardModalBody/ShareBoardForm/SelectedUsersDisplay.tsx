import React from 'react'
import { userSchemas } from '@/entities/user'
import { HiOutlineXMark } from 'react-icons/hi2'

interface SelectedUsersDisplayProps {
  selectedUsers: Array<userSchemas.User>
  removeSelectedUserFn: (user: userSchemas.User) => void
}

const SelectedUsersDisplay = React.memo(({ selectedUsers, removeSelectedUserFn }: SelectedUsersDisplayProps) => {
  const handleRemoveSelectedUser = (user: userSchemas.User) => {
    removeSelectedUserFn && removeSelectedUserFn(user)
  }

  return (
    <ul className='flex size-full list-none items-center gap-2'>
      {selectedUsers.map((user) => (
        <li key={user.id} className='flex max-w-fit items-center gap-2 rounded-sm bg-gray-200 px-1'>
          <span className='text-sm'>{user.fullName}</span>
          <button type='button' className='group' onClick={() => handleRemoveSelectedUser(user)}>
            <HiOutlineXMark className='rounded-sm text-lg group-hover:bg-gray-300' />
          </button>
        </li>
      ))}
    </ul>
  )
})

export default SelectedUsersDisplay
