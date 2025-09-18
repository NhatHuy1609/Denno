import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { cn } from '@/lib/styles/utils'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { cva, type VariantProps } from 'class-variance-authority'
import { useOnClickOutside } from '../_hooks/useOnClickOutSide'

const editableNameVariants = cva('font-medium', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl',
      xl: 'text-2xl'
    },
    color: {
      default: 'text-gray-700',
      white: 'text-white',
      primary: 'text-blue-600',
      danger: 'text-red-600'
    }
  },
  defaultVariants: {
    size: 'lg',
    color: 'default'
  }
})

type Props = {
  name: string
  enabledEdit?: boolean
  onSubmit?: (newName: string) => void
  fullWidth?: boolean
} & VariantProps<typeof editableNameVariants>

const EditableNameField = forwardRef<HTMLInputElement, Props>(
  ({ name, enabledEdit = false, onSubmit, size, color, fullWidth = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const spanRef = useRef<HTMLSpanElement>(null)
    const internalInputRef = useRef<HTMLInputElement>(null)

    // Sử dụng ref từ props nếu có, nếu không thì dùng internal ref
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalInputRef

    const [isShowInput, setIsShowInput] = useState(false)
    const [value, setValue] = useState(name)

    useEffect(() => {
      if (name) {
        setValue(name)
      }
    }, [name])

    useOnClickOutside(inputRef, () => {
      if (isShowInput) {
        setIsShowInput(false)
        handleSubmit()
      }
    })

    const handleSubmit = () => {
      const currentValue = inputRef.current?.value?.trim() || ''
      if (currentValue && currentValue !== name) {
        onSubmit?.(currentValue)
        setValue(currentValue)
      } else {
        setValue(name)
      }
    }

    const handleClick = () => {
      if (!enabledEdit) return
      setIsShowInput(true)
    }

    useEffect(() => {
      if (isShowInput && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isShowInput])

    // chỉ auto resize khi không bật fullWidth
    useEffect(() => {
      if (!fullWidth && spanRef.current && inputRef.current && containerRef.current) {
        const spanWidth = spanRef.current.offsetWidth
        inputRef.current.style.width = `${spanWidth + 12}px`
        containerRef.current.style.width = `${spanWidth + 20}px`
      }
    }, [value, isShowInput, fullWidth])

    return (
      <div className={cn('relative flex h-full items-center', fullWidth && 'w-full')} ref={containerRef}>
        <PrimaryInputText
          ref={inputRef}
          defaultValue={value}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit()
              setIsShowInput(false)
            }
          }}
          className={cn(editableNameVariants({ size, color }), 'absolute', fullWidth ? 'w-full' : '', {
            hidden: !isShowInput
          })}
        />

        <h1
          onClick={handleClick}
          className={cn(
            'absolute cursor-pointer whitespace-nowrap rounded-sm px-2 py-1 hover:bg-white/20 hover:opacity-100',
            editableNameVariants({ size, color }),
            fullWidth && 'w-full truncate',
            { hidden: isShowInput }
          )}
        >
          {value || ''}
        </h1>

        {/* 
          This hidden span is only rendered when `fullWidth` is false. 
          It is used as a "measuring element" to calculate the exact text width, 
          so we can dynamically adjust the input and container width to match the text length. 
        */}
        {!fullWidth && (
          <span
            ref={spanRef}
            className={cn('pl-2', editableNameVariants({ size, color }))}
            style={{
              visibility: 'hidden',
              position: 'absolute',
              display: 'block',
              whiteSpace: 'nowrap'
            }}
          >
            {value || ''}
          </span>
        )}
      </div>
    )
  }
)

EditableNameField.displayName = 'EditableNameField'

export default EditableNameField
