import React from 'react'
import GuestInformation from './GuestInformation'
import { workspaceSchemas } from '@/entities/workspace'
import GuestControls from './GuestControls'
import { GuestItemProvider } from './context'

type Props = {
  guest: workspaceSchemas.Workspace['guests'][0]
}

function GuestItem({ guest }: Props) {
  const { user: guestInfo, joinedBoards: guestJoinedBoards } = guest
  const { id: guestId } = guestInfo

  return (
    <GuestItemProvider
      value={{
        guestId,
        guestInfo,
        guestJoinedBoards
      }}
    >
      <div className='flex w-full items-center justify-between gap-6 py-2'>
        <GuestInformation name={guestInfo.fullName} avatar={guestInfo.avatar} email={guestInfo.email} />
        <GuestControls />
      </div>
    </GuestItemProvider>
  )
}

export default GuestItem
