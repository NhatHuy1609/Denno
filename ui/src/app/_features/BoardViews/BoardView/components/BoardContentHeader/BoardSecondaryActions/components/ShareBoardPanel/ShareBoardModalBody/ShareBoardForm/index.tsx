import React, { useCallback, useEffect, useRef, useState } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import CustomizableButton from '@/ui/components/CustomizableButton'
import DropdownMenuPrimary, {
  DropdownMenuPrimaryItemProps
} from '@/app/_components/DropdownMenuPrimary'
import { useDebounce } from '@/app/_hooks/useDebounce'
import { userTypes } from '@/entities/user'
import { useUsersQuery } from '@/app/_hooks/query/user/useUsersQuery'
import SearchedUsersResult from './SearchedUsersResult'
import SelectedUsersDisplay from './SelectedUsersDisplay'
import { cn } from '@/lib/styles/utils'
import useAddMultipleBoardMemberMutation from '@/app/_hooks/mutation/board/useAddMutipleBoardMember'
import { BoardQueries, boardTypes } from '@/entities/board'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { toastError, toastSuccess } from '@/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

type SearchedUserFilter = Pick<userTypes.UsersFilterQuery, 'email'>

function ShareBoardForm() {
  const [boardId, setRecentAccessBoardId] = useSyncedLocalStorage<string>(
    PersistedStateKey.RecentAccessBoard,
    ''
  )
  const queryClient = useQueryClient()

  // State to manage selected users for sharing the board
  const [selectedUsers, setSelectedUsers] = useState<Array<userTypes.User>>([])

  // These states are used to control the behavior of the search results
  const [showSearchedUsersResult, setShowSearchedUsersResult] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 650)

  // Fetch searched users using the debounced search term
  // This will only trigger when the search term changes
  const searchedUserFilter: SearchedUserFilter = {
    email: debouncedSearchTerm
  }
  const { data: searchedUsers } = useUsersQuery(searchedUserFilter)

  // Array of dropdown items for selecting board member roles
  const dropdownItems: Array<DropdownMenuPrimaryItemProps<boardTypes.BoardMemberRole>> = [
    {
      value: 'Member',
      label: 'Member',
      description: '',
      available: true
    },
    {
      value: 'Observer',
      label: 'Observer',
      description: 'Add people with limited permissions to this board.',
      available: true
    }
  ]

  // Refs to capture the selected role, search term
  const selectedRole = useRef<boardTypes.BoardMemberRole>(
    dropdownItems[0].value as boardTypes.BoardMemberRole
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)

  // Mutation hook to add multiple board members
  const { mutateAsync: addBoardMembersAsync, isPending } = useAddMultipleBoardMemberMutation({
    onSuccess: (data) => {
      // Reset selected users after successful share board action
      setSelectedUsers([])
      // Optionally, reset the search term and hide the search results
      setSearchTerm('')
      setShowSearchedUsersResult(false)
      // Invalidate the board query to refresh the board members list
      queryClient.invalidateQueries({
        queryKey: BoardQueries.boardQuery(boardId, {
          includeBoardMembers: true
        }).queryKey
      })

      toastSuccess('Board members added successfully!')
    },
    onError: (error) => {
      console.error('Error adding board members:', error)
      toastError('Failed to add board members. Please try again.')
    }
  })

  // Check if there are any searched users
  useEffect(() => {
    setShowSearchedUsersResult(Boolean(searchTerm))
  }, [searchTerm])

  const handleSelectBoardMemberRoleToShare = (item: { value: boardTypes.BoardMemberRole }) => {
    // Update the selected role
    selectedRole.current = item.value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleShareBoard = async () => {
    if (selectedUsers.length === 0) {
      return
    }

    // Prepare the member emails and description for the mutation
    const memberEmails = selectedUsers.map((user) => user.email)
    const description = descriptionInputRef.current?.value || ''

    // Call the mutation to add multiple board members
    await addBoardMembersAsync({
      boardId, // Replace with actual board ID
      memberEmails,
      description,
      role: selectedRole.current
    })
  }

  const handleSelectUser = useCallback(
    (selectedUser: userTypes.User) => {
      const isValidToSelect = !selectedUsers.find((user) => user.email === selectedUser.email)
      if (isValidToSelect) {
        setSelectedUsers((prev) => [...prev, selectedUser])

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

  const handleHideSearchedUsersResult = () => {
    setShowSearchedUsersResult(false)
  }

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='relative w-[65%]'>
        <div
          className={cn(
            'flex size-auto flex-wrap items-center overflow-hidden rounded-sm border-[1.5px] border-gray-200 bg-white p-1',
            inputRef.current?.focus ? 'border-blue-500' : ''
          )}
        >
          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className='h-full w-auto pl-2'>
              <SelectedUsersDisplay
                selectedUsers={selectedUsers}
                removeSelectedUserFn={handleRemoveSelectedUser}
              />
            </div>
          )}
          <input
            type='text'
            ref={inputRef}
            className='min-w-[240px] flex-1 p-2 text-sm hover:outline-none focus:outline-none'
            placeholder='Email address or name'
            onInput={handleInputChange}
          />
        </div>

        {/* Show searched users result if search term is present and there are searched users */}
        {searchTerm && searchedUsers && showSearchedUsersResult ? (
          <SearchedUsersResult
            searchedUserData={searchedUsers}
            selectUserFn={handleSelectUser}
            hideSearchedUsersResultFn={handleHideSearchedUsersResult}
          />
        ) : null}

        {/* Input for additional description when users are selected */}
        {selectedUsers.length > 0 && (
          <PrimaryInputText
            ref={descriptionInputRef}
            className='mt-4 w-full border-[1.5px] border-gray-500 p-2 pb-20'
            placeholder='Join me on Denno and lets work together on this board!'
          />
        )}
      </div>
      <div className='flex h-full gap-2'>
        <DropdownMenuPrimary items={dropdownItems} onSelect={handleSelectBoardMemberRoleToShare} />
        <CustomizableButton
          size='medium'
          value='Share'
          onClick={handleShareBoard}
          disabled={isPending}
          loading={isPending}
          className='max-h-fit justify-center'
        />
      </div>
    </div>
  )
}

export default ShareBoardForm
