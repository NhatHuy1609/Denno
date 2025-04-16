'use client'

import React, { useEffect } from 'react'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { setFixLoading } from '@/ui'
import { generateWorkspaceInvitationLink } from '@/utils/invitation-link'
import { useParams, useRouter } from 'next/navigation'
import useVerifyWorkspaceInvitationSecret from '@/app/_hooks/mutation/workspace/useVerifyWorkspaceInvitationSecret'

// This page is for checking the invite link to a workspace.
// It will redirect to accept-team page if the link is valid
function WorkspaceInvitePage() {
  const params = useParams()
  const router = useRouter()

  // This is the secret code from the invite link,
  // which first code is the workspaceId and the second code is the invitation secretCode
  const secrets = params.secrets
  const [workspaceId, secretCode] = secrets as string[]

  const { mutate: verifyInvitationSecret } = useVerifyWorkspaceInvitationSecret({
    onMutate: () => {
      setFixLoading(true)
    },
    onSuccess: () => {
      router.replace('/invite/accept-team')
    },
    onError: () => {
      router.push('/invite/invalid-link')
    },
    onSettled: () => {
      setFixLoading(false)
    }
  })

  // Check if the secrets are valid and redirect to the accept-team page
  useEffect(() => {
    if (secrets && secrets.length === 2) {
      // Set the invitation link in local storage
      setLocalStorageItem(PersistedStateKey.Invitation, `workspace/${workspaceId}/${secretCode}`)

      // Verify the invitation secret code
      verifyInvitationSecret({
        workspaceId: workspaceId as string,
        secretCode: secretCode as string
      })
    } else {
      router.push('/')
    }
  }, [secrets])

  return <></>
}

export default WorkspaceInvitePage
