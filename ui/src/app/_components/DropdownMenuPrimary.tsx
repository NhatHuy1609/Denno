import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@radix-ui/react-dropdown-menu'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '@/lib/styles/utils'

export interface DropdownMenuPrimaryItemProps<T> {
  value: T
  label: string
  description?: string
  available?: boolean
}

interface DropdownMenuPrimaryProps<T> {
  disabled?: boolean
  contentTitle?: string
  triggerTitle?: string
  triggerClassName?: string
  contentClassName?: string
  defaultSelectedIndex?: number
  items: DropdownMenuPrimaryItemProps<T>[]
  onSelect?: (item: DropdownMenuPrimaryItemProps<T>) => void
  renderOtherItems?: () => ReactNode
}

export default function DropdownMenuPrimary<T>({
  disabled = false,
  contentTitle,
  triggerTitle,
  triggerClassName,
  contentClassName,
  defaultSelectedIndex = 0,
  items,
  onSelect,
  renderOtherItems
}: DropdownMenuPrimaryProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultSelectedIndex)

  useEffect(() => {
    setSelectedIndex(defaultSelectedIndex)
  }, [defaultSelectedIndex])

  const handleSelectItem = (index: number) => {
    const selectedItem = items[index]
    if (!selectedItem || !selectedItem.value || !selectedItem.available) {
      return
    }

    setSelectedIndex(index)
    if (onSelect) {
      onSelect(items[index])
    }
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild disabled={disabled} className={cn('min-w-32 justify-center', triggerClassName)}>
        <CustomizableButton
          autoFocus={isOpen}
          size='medium'
          intent='secondary'
          value={triggerTitle ? triggerTitle : String(items[selectedIndex]?.label)}
          endIcon={<FaAngleDown className='text-lg' />}
          className={cn('max-h-fit', {
            'bg-blue-100 text-blue-500 hover:bg-blue-200': isOpen
          })}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn('min-w-78 z-[999] max-w-[320px] rounded-md bg-white py-2 shadow-lg', contentClassName)}
      >
        {contentTitle && (
          <DropdownMenuLabel className='py-2 text-center text-sm font-medium text-slate-700'>
            {contentTitle}
          </DropdownMenuLabel>
        )}
        {items.map((item, index) => (
          <DropdownMenuItem key={index} className='hover:outline-none' onSelect={() => handleSelectItem(index)}>
            {/* Render value and description if value is not empty */}
            {item.label && (
              <div
                className={cn(
                  'flex cursor-pointer flex-col px-4 py-2 hover:bg-gray-100 hover:outline-none',
                  selectedIndex === index ? 'border-l-2 border-blue-500 bg-blue-100 hover:bg-blue-200' : '',
                  item.available === false ? 'cursor-not-allowed opacity-50' : ''
                )}
              >
                <span
                  className={cn('text-sm font-semibold text-gray-600', {
                    'text-blue-500': selectedIndex === index
                  })}
                >
                  {String(item.label)}
                </span>
                <span className='text-xs text-gray-500'>{item.description}</span>
              </div>
            )}
          </DropdownMenuItem>
        ))}
        {/* Render description if it's a ReactNode */}
        {renderOtherItems && renderOtherItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
