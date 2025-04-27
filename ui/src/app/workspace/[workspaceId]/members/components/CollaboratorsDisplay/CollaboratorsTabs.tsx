import React from 'react'
import type { Tabs } from './types'
import TabButton from './TabButton'

type Props = {
  setTabFn: (val: Tabs) => void
  memberCount?: number
  guestCount?: number
  requestCount?: number
}

function CollaboratorsTabs({ setTabFn, memberCount = 0, guestCount = 0, requestCount = 0 }: Props) {
  return (
    <div className='flex min-w-[250px] flex-col gap-2'>
      <TabButton
        tabName='members'
        setTabFn={setTabFn}
        text={`Workspace members (${memberCount})`}
      />
      <TabButton text={`Guests (${guestCount})`} tabName='guests' setTabFn={setTabFn} />
      <TabButton text={`Requests (${requestCount})`} tabName='requests' setTabFn={setTabFn} />
    </div>
  )
}

export default CollaboratorsTabs
