import React from 'react'
import { cn } from '@/lib/styles/utils'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

type NameFilterInputProps = {
  className?: string
}

const NameFilterInput = React.forwardRef<HTMLInputElement, NameFilterInputProps>(
  ({ className }, ref) => (
    <PrimaryInputText
      ref={ref}
      placeholder='Filter by name'
      className={cn('mt-4 w-[250px] border border-black p-2', className)}
    />
  )
)

export default NameFilterInput
