import React, { ReactNode, useRef, useState } from 'react'
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

interface DropdownMenuPrimaryProps {
  contentTitle?: string
  triggerTitle: string
  items: {
    title: string
    description?: string | ReactNode
  }[]
  onSelect?: (item: { title: string; description?: string | ReactNode }) => void
  defaultSelectedIndex?: number
}

function DropdownMenuPrimary({
  contentTitle,
  triggerTitle,
  items,
  onSelect,
  defaultSelectedIndex = 0
}: DropdownMenuPrimaryProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    defaultSelectedIndex ?? null
  )
  const selectedItemRef = useRef<number>(0)

  const handleSelectItem = (index: number) => {
    if (onSelect) {
      onSelect(items[index])
      selectedItemRef.current = index
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CustomizableButton
          intent='secondary'
          value={triggerTitle}
          size='medium'
          endIcon={<FaAngleDown className='text-lg' />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-78 rounded-md bg-white py-2 shadow-lg'>
        {contentTitle && <DropdownMenuLabel title={contentTitle} />}
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onSelect={() => handleSelectItem(index)}>
            <div
              className={cn(
                'flex cursor-pointer flex-col bg-blue-100 px-4 py-2 hover:bg-blue-300',
                selectedItemIndex === index ? 'border-l-2 border-blue-500' : ''
              )}
            >
              <span className='text-sm font-semibold text-blue-500'>{item.title}</span>
              {item.description && (
                <span className='text-sm text-gray-500'>{item.description}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuPrimary
