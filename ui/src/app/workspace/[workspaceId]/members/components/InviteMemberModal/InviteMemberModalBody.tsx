import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useUsersQuery } from '@/app/_hooks/query/user/useUsersQuery'
import { userTypes } from '@/entities/user'
import { useDebounce } from '@/app/_hooks/useDebounce'
import { useCreateInvitationLink } from '@/app/_hooks/useCreateInvitationLink'
import { useCopyToClipboard } from '@/app/_hooks/useCopyToClipboard'
import { useInvitationSecretQuery } from '@/app/_hooks/query/workspace/useWorkspaceInvitationSecretQuery'
import useAddMultipleWorkspaceMemberMutation from '@/app/_hooks/mutation/workspace/useAddMultipleWorkspaceMember'
import useDisableInvitationSecretMutation from '@/app/_hooks/mutation/workspace/useDisableInvitationSecretMutation'
import { WorkspaceQueries } from '@/entities/workspace'
import { FaLink, FaRegCircleCheck } from 'react-icons/fa6'
import { HiOutlineXMark } from 'react-icons/hi2'
import { toastError, toastSuccess } from '@/ui'
import SearchedUsersResult from './SearchedUsersResult'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import CustomizableButton from '@/ui/components/CustomizableButton'
import InviteMemberDescriptionInput from './InviteMemberDescriptionInput'
import { generateWorkspaceInvitationLink } from '@/utils/invitation-link'

type SearchedUserFilter = Pick<userTypes.UsersFilterQuery, 'email'>

type InviteMemberModalBodyProps = {
  closeModalFn: () => void
}

export default function InviteMemberModalBody({ closeModalFn }: InviteMemberModalBodyProps) {
  const queryClient = useQueryClient()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const inputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)

  const [selectedUsers, setSelectedUsers] = useState<Array<userTypes.User>>([])

  const {
    data: invitationSecret,
    isError,
    refetch
  } = useInvitationSecretQuery(workspaceId, {
    retry: 1
  })

  const { mutateAsync: disableLinkAsync, isPending: isDisablingLink } =
    useDisableInvitationSecretMutation({
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId).queryKey
        })
      }
    })

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

  // These states are used to control the behavior of the search results
  const [showSearchedUsersResult, setShowSearchedUsersResult] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 650)

  // Handle create invitation link and copy to clipboard
  const [_, copy] = useCopyToClipboard()
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)
  const { createInvitationLink: createInvitationLink, isCreatingLink } =
    useCreateInvitationLink(workspaceId)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch searched users using the debounced search term
  // This will only trigger when the search term changes
  const searchedUserFilter: SearchedUserFilter = {
    email: debouncedSearchTerm
  }
  const { data: searchedUsers } = useUsersQuery(searchedUserFilter)

  // Check if there are any searched users
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
    // Call mutation api to add members
    addWorkspaceMember({
      workspaceId,
      description: descriptionInputRef.current?.value || '',
      memberEmails: selectedUsers.map((user) => user.email)
    })
  }

  const handleDisableLink = async () => {
    await disableLinkAsync(workspaceId)
  }

  const showDisableLinkButton = Boolean(invitationSecret?.secretCode)
  console.log('Invitation secret: ', invitationSecret)
  // console.log('IS show disable link button', showDisableLinkButton)

  // Handle create invitation link and copy to clipboard
  const handleClickCreateLinkButton = async () => {
    var link = await createInvitationLink()
    if (link) {
      await copy(link)
      setIsCopiedSuccess(true)

      // Invalidate the query to refresh the invitation secret
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId).queryKey
      })

      // Clear the timeout if it exists before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // This ensures that the copied state is reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopiedSuccess(false)
      }, 2000)
    }
  }

  const handleCopyExistingLink = () => {
    if (!invitationSecret?.secretCode) return

    const invitationLink = generateWorkspaceInvitationLink(
      workspaceId,
      invitationSecret?.secretCode
    )

    if (invitationLink) {
      copy(invitationLink)
      setIsCopiedSuccess(true)

      // Clear the timeout if it exists before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // This ensures that the copied state is reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopiedSuccess(false)
      }, 2000)
    }
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
          {showDisableLinkButton && (
            <button
              type='button'
              className='w-fit cursor-pointer text-xs font-medium text-blue-600 underline decoration-transparent underline-offset-1 hover:decoration-inherit'
              disabled={isDisablingLink}
              onClick={handleDisableLink}
            >
              Disable link
            </button>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          {invitationSecret?.secretCode ? (
            <CustomizableButton
              size='small'
              disabled={isCreatingLink}
              startIcon={<FaLink className='text-base' />}
              className='min-w-24 bg-gray-200 text-sm font-medium text-black'
              value={'Copy link'}
              onClick={handleCopyExistingLink}
            />
          ) : (
            <CustomizableButton
              size='small'
              disabled={isCreatingLink}
              startIcon={<FaLink className='text-base' />}
              className='min-w-24 bg-gray-200 text-sm font-medium text-black'
              value={'Create link'}
              onClick={handleClickCreateLinkButton}
            />
          )}

          {!isCreatingLink && isCopiedSuccess && (
            <div className='flex w-[200px] items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-800'>
              <FaRegCircleCheck className='text-green-800' /> Link copied to clipboard
            </div>
          )}
        </div>
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
