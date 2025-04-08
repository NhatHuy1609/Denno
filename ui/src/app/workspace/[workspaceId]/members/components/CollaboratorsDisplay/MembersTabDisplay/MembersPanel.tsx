import React, { useRef } from 'react'
import NameFilterInput from '../NameFilterInput'
import { Workspace } from '@/entities/workspace/workspace.types'

type MembersPanelProps = {
  workspace: Workspace
}

function MembersPanel({ workspace }: MembersPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  console.log('WORKSPACE', workspace)

  return (
    <div className='w-full'>
      <NameFilterInput ref={inputRef} />
      <div className='mt-4 h-[100px] w-full border-y border-gray-300 py-2'></div>
    </div>
  )
}

export default MembersPanel
