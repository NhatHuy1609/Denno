import React, { useEffect, useState } from 'react'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { setFixLoading } from '@/ui'
import { useParams, useRouter } from 'next/navigation'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useBoardQuery } from '@/app/_hooks/query'
import useVerifyBoardInvitationSecret from '@/app/_hooks/mutation/board/useVerifyWorkspaceInvitationSecret'

// This page is for checking the invite link to a board.
// It will redirect to accept-board page if the link is valid
// and will redirect to invalid-link page if the link is invalid
function BoardInvitePage() {
  const params = useParams()
  const router = useRouter()

  // This is the secret code from the invite link,
  // which first code is the boardId and the second code is the invitation secretCode
  const secrets = params.secrets
  const [boardId, secretCode] = secrets as string[]

  // Flag to check if the current user is already a member of the invited board
  const [isAlreadyMember, setIsAlreadyMember] = useState(false)
  // Flag to check whether the membership check has been done
  const [isCheckingAlreadyMemberDone, setIsCheckingAlreadyMemberDone] = useState(false)
  // Get the board data and current user data so we can check if the current user is already a member of the invited board
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useMe()
  const { data: boardData, isLoading: isLoadingBoardData } = useBoardQuery(boardId, {
    includeBoardMembers: true
  })
  const { members: boardMembers } = boardData || {}

  const { mutate: verifyInvitationSecret } = useVerifyBoardInvitationSecret({
    onMutate: () => {
      setFixLoading(true)
    },
    onSuccess: () => {
      router.replace('/invite/accept-board')
    },
    onError: () => {
      router.replace('/invite/invalid-link')
    },
    onSettled: () => {
      setFixLoading(false)
    }
  })

  // Check if the current user is already a member of the invited board
  useEffect(() => {
    if (isLoadingCurrentUser || isLoadingBoardData) return

    if (boardMembers && currentUser) {
      const isMember = boardMembers.some((member) => member.memberId === currentUser.id)

      if (isMember) {
        router.replace(`/board/${boardId}`)
        setIsAlreadyMember(true)
      }
    }

    setIsCheckingAlreadyMemberDone(true)
  }, [boardMembers, currentUser, isLoadingCurrentUser, isLoadingBoardData])

  // Check if the secrets are valid and redirect to the accept-team page
  useEffect(() => {
    const handleVerifyInvitationSecret = () => {
      // Set the invitation link in local storage
      setLocalStorageItem(PersistedStateKey.Invitation, `board/${boardId}/${secretCode}`)

      // Verify the invitation secret code
      verifyInvitationSecret({
        boardId: boardId as string,
        secretCode: secretCode as string
      })
    }

    if (isCheckingAlreadyMemberDone && !isAlreadyMember && secrets && secrets.length === 2) {
      handleVerifyInvitationSecret()
    }
  }, [secrets, isAlreadyMember, isCheckingAlreadyMemberDone])

  return <></>
}

export default BoardInvitePage
