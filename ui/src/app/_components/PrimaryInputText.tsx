import React, { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/styles/utils'

type Props = InputHTMLAttributes<HTMLInputElement>

const PrimaryInputText = React.forwardRef<HTMLInputElement, Props>(
  ({ className, defaultValue, ...props }, ref) => {
    return (
      <input
        ref={ref}
        defaultValue={defaultValue}
        className={cn(
          'rounded-sm border-2 border-transparent px-2 py-1 text-sm text-black outline-none focus:border-blue-500',
          className
        )}
        {...props}
      />
    )
  }
)

export default PrimaryInputText
