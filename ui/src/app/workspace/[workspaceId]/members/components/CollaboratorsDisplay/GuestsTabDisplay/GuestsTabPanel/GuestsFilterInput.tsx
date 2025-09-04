import React, { useRef } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

type Props = {
  onChange: (name: string) => void
}

function GuestsFilterInput({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='my-2 w-full'>
      <PrimaryInputText
        placeholder='Filter by name'
        ref={inputRef}
        className='border border-gray-400 p-2'
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default GuestsFilterInput
