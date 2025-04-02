import React, { useState, useRef, useEffect, useCallback } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useUsersQuery } from '@/app/_hooks/query/user/useUsersQuery'
import { userTypes } from '@/entities/user'
import { useDebounce } from '@/app/_hooks/useDebounce'
import SearchedUsersResult from './SearchedUsersResult'
import InviteMemberDescriptionInput from './InviteMemberDescriptionInput'
import { FaLink } from 'react-icons/fa6'
import { HiOutlineXMark } from 'react-icons/hi2'
import CustomizableButton from '@/ui/components/CustomizableButton'
import useAddMultipleWorkspaceMemberMutation from '@/app/_hooks/mutation/workspace/useAddMultipleWorkspaceMember'
import { useParams } from 'next/navigation'
import { toastError, toastSuccess } from '@/ui'

type SearchedUserFilter = Pick<userTypes.UsersFilterQuery, 'email'>

type Props = {
  closeModalFn: () => void
}

export default function InviteMemberModalBody({ closeModalFn }: Props) {
  const { workspaceId } = useParams()

  const inputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)

  const [selectedUsers, setSelectedUsers] = useState<Array<userTypes.User>>([])

  const [showSearchedUsersResult, setShowSearchedUsersResult] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 650)

  const { mutate: addWorkspaceMember } = useAddMultipleWorkspaceMemberMutation({
    mutationKey: [workspaceId],
    onSuccess: (data) => {
      toastSuccess('Members added successfully')
    },
    onError: (error) => {
      console.error('Error adding members:', error)
      toastError('Failed to add members')
    },
    onSettled: () => {
      closeModalFn && closeModalFn()
    }
  })

  const searchedUserFilter: SearchedUserFilter = {
    email: debouncedSearchTerm
  }

  const { data: searchedUsers } = useUsersQuery(searchedUserFilter)

  useEffect(() => {
    setShowSearchedUsersResult(Boolean(searchTerm))
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleHideSearchedUsersResult = () => {
    setShowSearchedUsersResult(false)
  }

  const handleSelectUser = useCallback(
    (user: userTypes.User) => {
      const isValidToSelect = !selectedUsers.find((user) => user.email === searchTerm)
      if (isValidToSelect) {
        setSelectedUsers((prev) => [...prev, user])

        // Reset search input
        if (inputRef.current) {
          inputRef.current.value = ''
        }
        setSearchTerm('')
      }
    },
    [selectedUsers]
  )

  const handleRemoveSelectedUser = useCallback(
    (user: userTypes.User) => {
      const removedUserIndex = selectedUsers.findIndex(
        (selectedUser) => selectedUser.email === user.email
      )

      if (removedUserIndex !== -1) {
        setSelectedUsers((prev) => {
          const newSelectedUsers = [...prev]
          newSelectedUsers.splice(removedUserIndex, 1)
          return newSelectedUsers
        })
      }
    },
    [selectedUsers]
  )

  const handleAddWorkspaceMember = () => {
    addWorkspaceMember({
      workspaceId: workspaceId as string,
      description: descriptionInputRef.current?.value || '',
      memberEmails: selectedUsers.map((user) => user.email)
    })
  }

  return (
    <div className='relative w-full'>
      {/* Selected users */}
      {selectedUsers.length > 0 && (
        <SelectedUsersDisplay
          selectedUsers={selectedUsers}
          removeSelectedUserFn={handleRemoveSelectedUser}
        />
      )}

      <div className='flex items-center justify-between gap-2'>
        <PrimaryInputText
          ref={inputRef}
          onInput={handleInputChange}
          className='w-full border-[1.5px] border-gray-500 p-2'
          placeholder='Email address or name'
        />
        {selectedUsers.length > 0 && (
          <CustomizableButton
            onClick={handleAddWorkspaceMember}
            value='Send invite'
            className='h-full min-w-[120px] justify-center py-[10px]'
          />
        )}
      </div>

      {searchTerm && searchedUsers && showSearchedUsersResult ? (
        <SearchedUsersResult
          searchedUserData={searchedUsers}
          selectUserFn={handleSelectUser}
          hideSearchedUsersResultFn={handleHideSearchedUsersResult}
        />
      ) : null}

      {selectedUsers.length > 0 ? <InviteMemberDescriptionInput ref={descriptionInputRef} /> : null}

      <div className='mt-6 flex w-full justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>Invite someone to this Workspace with a link: </p>
          <span className='text-xs font-medium text-blue-600'>Disable link</span>
        </div>

        <CustomizableButton
          value='Copy link'
          size='small'
          startIcon={<FaLink className='text-base' />}
          className='min-w-24 bg-gray-200 text-sm font-medium text-black'
        />
      </div>
    </div>
  )
}

interface SelectedUsersDisplayProps {
  selectedUsers: Array<userTypes.User>
  removeSelectedUserFn: (user: userTypes.User) => void
}

const SelectedUsersDisplay = React.memo(
  ({ selectedUsers, removeSelectedUserFn }: SelectedUsersDisplayProps) => {
    const handleRemoveSelectedUser = (user: userTypes.User) => {
      removeSelectedUserFn && removeSelectedUserFn(user)
    }

    return (
      <div className='mb-3 border-l-2 border-blue-600 pl-2'>
        <h4 className='mb-1 text-sm text-blue-600'>Selected users</h4>
        <div className='flex w-full items-center gap-2'>
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className='flex max-w-fit items-center gap-2 rounded-sm bg-gray-200 p-1'
            >
              <span className='text-sm'>{user.fullName}</span>
              <button
                type='button'
                className='group'
                onClick={() => handleRemoveSelectedUser(user)}
              >
                <HiOutlineXMark className='text-lg group-hover:text-blue-600' />
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
