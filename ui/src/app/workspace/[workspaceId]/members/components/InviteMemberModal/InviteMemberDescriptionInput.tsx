import React from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

type Props = {
  className?: string
}

const InviteMemberDescriptionInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className }, ref) => (
    <PrimaryInputText
      ref={ref}
      className='mt-4 w-full border-[1.5px] border-gray-500 p-2 pb-20'
      placeholder='Join this Denno Workspace to start collaborating with me'
    />
  )
)

export default InviteMemberDescriptionInput
