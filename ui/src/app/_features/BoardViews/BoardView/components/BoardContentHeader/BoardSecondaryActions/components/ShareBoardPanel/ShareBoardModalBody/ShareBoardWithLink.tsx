import React, { useEffect, useRef, useState } from 'react'
import { BoardQueries, boardSchemas } from '@/entities/board'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { generateBoardInvitationLink } from '@/utils/invitation-link'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateBoardInvitationLink } from '@/app/_hooks/useCreateBoardInvitationLink'
import { useCopyToClipboard } from '@/app/_hooks/useCopyToClipboard'
import { useBoardInvitationSecretQuery } from '@/app/_hooks/query/board/useBoardInvitationSecretQuery'
import useDisableBoardInvitationSecretMutation from '@/app/_hooks/mutation/board/useDisableBoardInvitationSecretMutation'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { FiLink } from 'react-icons/fi'
import UnderlineLinkButton from '@/app/_components/UnderlineLinkButton'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import DropdownMenuPrimary, { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

function ShareBoardWithLink() {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const queryClient = useQueryClient()

  const { data: boardInvitationSecret } = useBoardInvitationSecretQuery(boardId, {
    retry: 1
  })

  const { mutateAsync: disableBoardShareLinkAsync, isPending: isDisablingLink } =
    useDisableBoardInvitationSecretMutation({
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: BoardQueries.boardInvitationSecretQuery(boardId).queryKey
        })
      }
    })

  // Handle create invitation link on client and copy to clipboard
  const [shareBoardLinkPermission, setShareBoardLinkPermission] = useState<boardSchemas.BoardMemberRole | null>(null)
  const [_, copy] = useCopyToClipboard()
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)
  const { createBoardInvitationLink, isCreatingLink } = useCreateBoardInvitationLink(
    boardId,
    shareBoardLinkPermission ?? 'Member'
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Effect to handle the change in share board link permission when link is existing
  useEffect(() => {
    const handleUpdateShareBoardLinkPermission = async () => {
      // Deleting the existing board invitation secret if it exists
      if (boardInvitationSecret?.secretCode) {
        await disableBoardShareLinkAsync(boardId)
      }
      // Creating a new board invitation link with the updated permission
      await handleCreateBoardShareLinkButton()
    }

    if (shareBoardLinkPermission) {
      handleUpdateShareBoardLinkPermission()
    }
  }, [shareBoardLinkPermission])

  // Handle create board invitation link and copy to clipboard
  const handleCreateBoardShareLinkButton = async () => {
    var link = await createBoardInvitationLink()
    if (link) {
      await copy(link)
      setIsCopiedSuccess(true)

      // Invalidate the query to refresh the invitation secret
      queryClient.invalidateQueries({
        queryKey: BoardQueries.boardInvitationSecretQuery(boardId).queryKey
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

  const handleCopyExistingBoardShareLink = () => {
    if (!boardInvitationSecret?.secretCode) return
    // Generate the invitation link using the board ID and the existing secret code
    const invitationLink = generateBoardInvitationLink(boardId, boardInvitationSecret?.secretCode)

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

  const handleDisableBoardShareLink = async () => {
    await disableBoardShareLinkAsync(boardId)
  }

  const renderShareBoardLinkActions = () => {
    if (isDisablingLink || isCreatingLink) {
      return (
        <>
          <WaterFallLoading />
        </>
      )
    }

    return (
      <>
        {!boardInvitationSecret ? (
          <UnderlineLinkButton value='Create link' onClick={handleCreateBoardShareLinkButton} />
        ) : (
          <div className='flex gap-2'>
            <UnderlineLinkButton value='Copy link' onClick={handleCopyExistingBoardShareLink} />
            <UnderlineLinkButton value='Disable link' onClick={handleDisableBoardShareLink} />
          </div>
        )}
      </>
    )
  }

  // Dropdown items for changing permissions when sharing the board link
  const permissionsDropdownItems: Array<DropdownMenuPrimaryItemProps<boardSchemas.BoardMemberRole>> = [
    {
      value: 'Member',
      label: 'Can join as member',
      available: true,
      description: 'Board members can view and edit cards, lists, and some board settings.'
    },
    {
      value: 'Observer',
      label: 'Can join as observer',
      available: true,
      description: 'Board observers can view and comment.'
    }
  ]

  const handleSelectShareBoardLinkPermission = (item: DropdownMenuPrimaryItemProps<boardSchemas.BoardMemberRole>) => {
    const { value } = item
    if (!value) return

    // Update the share board link permission state
    setShareBoardLinkPermission(value)
  }

  return (
    <>
      <div className='flex w-full gap-2'>
        <div className='flex w-[65%] gap-2'>
          <div className='flex items-center justify-center rounded-md bg-gray-100 p-3 text-gray-600'>
            <FiLink className='text-sm text-black' />
          </div>
          <div className='flex h-full w-auto flex-1 flex-col justify-between'>
            <span className='text-base text-sm text-black'>
              {boardInvitationSecret ? 'Anyone with the link can join as a member' : 'Share this board with a link'}
            </span>
            {renderShareBoardLinkActions()}
          </div>
        </div>
        {boardInvitationSecret && (
          <DropdownMenuPrimary
            triggerTitle='Change permissions'
            triggerClassName='flex-1'
            items={permissionsDropdownItems}
            onSelect={handleSelectShareBoardLinkPermission}
          />
        )}
      </div>
      {!isCreatingLink && isCopiedSuccess && (
        <div className='flex w-[200px] items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-800'>
          <FaRegCircleCheck className='text-green-800' /> Link copied to clipboard
        </div>
      )}
    </>
  )
}

export default ShareBoardWithLink
