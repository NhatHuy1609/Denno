'use client'

import React, { useEffect, useState } from 'react'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { setFixLoading } from '@/ui'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useParams, useRouter } from 'next/navigation'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import useVerifyWorkspaceInvitationSecret from '@/app/_hooks/mutation/workspace/useVerifyWorkspaceInvitationSecret'

// This page is for checking the invite link to a workspace.
// It will redirect to accept-team page if the link is valid
// and will redirect to invalid-link page if the link is invalid
function WorkspaceInvitePage() {
  const params = useParams()
  const router = useRouter()

  // This is the secret code from the invite link,
  // which first code is the workspaceId and the second code is the invitation secretCode
  const secrets = params.secrets
  const [workspaceId, secretCode] = secrets as string[]

  // Flag to check if the current user is already a member of the invited workspace
  const [isAlreadyMember, setIsAlreadyMember] = useState(false)
  // Flag to check whether the membership check has been done
  const [isCheckingAlreadyMemberDone, setIsCheckingAlreadyMemberDone] = useState(false)
  // Get the workspace data and current user data so we can check if the current user is already a member of the invited workspace
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useMe()
  const { data: workspaceMembers, isLoading: isLoadingWorkspaceMembers } = useWorkspaceQuery(workspaceId, {
    members: true
  })

  const { mutate: verifyInvitationSecret } = useVerifyWorkspaceInvitationSecret({
    onMutate: () => {
      setFixLoading(true)
    },
    onSuccess: () => {
      router.replace('/invite/accept-team')
    },
    onError: () => {
      router.replace('/invite/invalid-link')
    },
    onSettled: () => {
      setFixLoading(false)
    }
  })

  // Check if the current user is already a member of the invited workspace
  useEffect(() => {
    if (isLoadingCurrentUser || isLoadingWorkspaceMembers) return

    if (workspaceMembers && workspaceMembers.members && currentUser) {
      const isMember = workspaceMembers.members.some((member) => member.id === currentUser.id)

      if (isMember) {
        router.replace(`/workspace/${workspaceId}/members`)
        setIsAlreadyMember(true)
      }
    }

    setIsCheckingAlreadyMemberDone(true)
  }, [workspaceMembers, currentUser, isLoadingCurrentUser, isLoadingWorkspaceMembers])

  // Check if the secrets are valid and redirect to the accept-team page
  useEffect(() => {
    const handleVerifyInvitationSecret = () => {
      // Set the invitation link in local storage
      setLocalStorageItem(PersistedStateKey.Invitation, `workspace/${workspaceId}/${secretCode}`)

      // Verify the invitation secret code
      verifyInvitationSecret({
        workspaceId: workspaceId as string,
        secretCode: secretCode as string
      })
    }

    if (isCheckingAlreadyMemberDone && !isAlreadyMember && secrets && secrets.length === 2) {
      handleVerifyInvitationSecret()
    }
  }, [secrets, isAlreadyMember, isCheckingAlreadyMemberDone])

  return <></>
}

export default WorkspaceInvitePage
