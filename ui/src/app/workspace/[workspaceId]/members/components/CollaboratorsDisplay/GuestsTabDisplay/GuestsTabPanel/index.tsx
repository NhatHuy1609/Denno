import React, { useEffect, useState } from 'react'
import GuestsFilterInput from './GuestsFilterInput'
import GuestsDisplay from './GuestsDisplay'
import { workspaceSchemas } from '@/entities/workspace'

type Props = {
  guests: workspaceSchemas.Workspace['guests']
}

function GuestsTabPanel({ guests }: Props) {
  const [nameFilter, setNameFilter] = useState<string>('')
  const [guestsDisplay, setGuestsDisplay] = useState<typeof guests>(guests)

  // Sync state with latest guests props
  useEffect(() => {
    setGuestsDisplay(guests)
  }, [guests])

  useEffect(() => {
    // If name input is empty then reset to initial state
    if (!nameFilter) {
      setGuestsDisplay(guests)
    }

    setGuestsDisplay(guests.filter((guest) => guest.user.fullName.toLowerCase().includes(nameFilter.toLowerCase())))
  }, [nameFilter])

  const handleGuestsFilterInputChange = (name: string) => {
    setNameFilter(name)
  }

  return (
    <div className='flex w-full flex-col'>
      <GuestsFilterInput onChange={handleGuestsFilterInputChange} />
      <GuestsDisplay guests={guestsDisplay} />
    </div>
  )
}

export default GuestsTabPanel
