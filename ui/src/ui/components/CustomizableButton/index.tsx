import React, { ReactNode } from 'react'
import { cn } from '@/lib/styles/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('inline-flex items-center gap-2 rounded-sm', {
  variants: {
    intent: {
      primary: ['bg-blue-600 text-white'],
      ghost: ['bg-transparent'],
      icon: ['bg-transparent justify-center']
    },
    size: {
      small: ['text-sm', 'py-1.5', 'px-2'],
      medium: ['text-base', 'py-2', 'px-3'],
      icon: ['aspect-square']
    },
    disabled: {
      false: null,
      true: ['opacity-50', 'cursor-not-allowed']
    }
  },
  compoundVariants: [
    {
      intent: 'ghost',
      disabled: false,
      class: 'hover:bg-gray-300 hover:font-medium'
    }
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'small',
    disabled: false
  }
})

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> &
  VariantProps<typeof buttonVariants> & {
    value?: string
    startIcon?: ReactNode
    endIcon?: ReactNode
    className?: string
  }

const CustomizableButton = ({
  value,
  startIcon,
  endIcon,
  intent,
  size,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(className, buttonVariants({ intent, size, disabled, className }))}
      disabled={disabled || undefined}
      {...props}
    >
      {startIcon}
      {value && <span className='text-sm'>{value}</span>}
      {endIcon}
    </button>
  )
}

export default CustomizableButton
