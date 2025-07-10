import React, { ReactNode } from 'react'
import { cn } from '@/lib/styles/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center gap-2 rounded-sm font-medium hover:opacity-80',
  {
    variants: {
      intent: {
        primary: ['bg-blue-600 text-white'],
        secondary: ['bg-gray-200 text-black'],
        ghost: ['bg-transparent'],
        icon: ['bg-transparent justify-center']
      },
      size: {
        small: ['text-[13px]', 'py-1.5', 'px-2'],
        medium: ['text-base', 'py-2', 'px-3'],
        icon: ['aspect-square']
      },
      disabled: {
        false: null,
        true: ['opacity-50', 'cursor-not-allowed', 'bg-gray-200', 'text-black']
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
  }
)

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> &
  VariantProps<typeof buttonVariants> & {
    value?: string
    startIcon?: ReactNode
    endIcon?: ReactNode
    loading?: boolean
    className?: string
  }

const CustomizableButton = ({
  value,
  startIcon,
  endIcon,
  intent,
  size,
  disabled,
  loading = false,
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
      {loading && (
        <div
          style={{
            scale: 0.55
          }}
          className='inline-block aspect-square h-full animate-spin rounded-full border-2 border-gray-300 border-t-transparent'
        ></div>
      )}
    </button>
  )
}

export default CustomizableButton
