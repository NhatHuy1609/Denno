import React, { ReactNode, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '@/lib/styles/utils'

export interface DropdownMenuPrimaryItemProps<T> {
  value: T
  description?: string
}

interface DropdownMenuPrimaryProps<T> {
  contentTitle?: string
  triggerTitle: string
  items: DropdownMenuPrimaryItemProps<T>[]
  onSelect?: (item: DropdownMenuPrimaryItemProps<T>) => void
  defaultSelectedIndex?: number
  renderOtherItems?: () => ReactNode
}

function DropdownMenuPrimary<T>({
  contentTitle,
  triggerTitle,
  items,
  onSelect,
  defaultSelectedIndex = 0,
  renderOtherItems
}: DropdownMenuPrimaryProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultSelectedIndex)

  const handleSelectItem = (index: number) => {
    const selectedItem = items[index]
    if (!selectedItem || !selectedItem.value) {
      return
    }

    setSelectedIndex(index)
    if (onSelect) {
      onSelect(items[index])
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='min-w-32 justify-center'>
        <CustomizableButton
          intent='secondary'
          value={String(items[selectedIndex]?.value) || triggerTitle}
          size='medium'
          endIcon={<FaAngleDown className='text-lg' />}
          className='max-h-fit'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-78 rounded-md bg-white py-2 shadow-lg'>
        {contentTitle && <DropdownMenuLabel title={contentTitle} />}
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onSelect={() => handleSelectItem(index)}>
            {/* Render value and description if value is not empty */}
            {item.value && (
              <div
                className={cn(
                  'flex cursor-pointer flex-col bg-blue-100 px-4 py-2 hover:bg-blue-300 hover:outline-none',
                  selectedIndex === index ? 'border-l-2 border-blue-500' : ''
                )}
              >
                <span className='text-sm font-semibold text-blue-500'>{String(item.value)}</span>
                <span className='text-sm text-gray-500'>{item.description}</span>
              </div>
            )}
            {/* Render description if it's a ReactNode */}
            {renderOtherItems && <div className='cursor-pointer'>{renderOtherItems()}</div>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuPrimary
