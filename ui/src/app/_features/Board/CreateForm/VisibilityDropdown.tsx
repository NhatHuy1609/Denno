import { ReactNode } from 'react'
import type { enumTypes } from '@/service/api/_enums'
import { cn } from '@/lib/styles/utils'
import { useBoardCreateForm } from './context'
import { boardVisibilityDescriptions } from '@/data/enum-detail'
import { DropdownMenu } from '@/ui'
import { RiEarthFill } from 'react-icons/ri'
import { FaAngleDown, FaUserFriends, FaLock } from 'react-icons/fa'

type VisibilityItem = {
  icon: ReactNode
  value: enumTypes.BoardVisibilityEnum
  description: string
}

const VisibilitySelectionCard = ({ item }: { item: VisibilityItem }) => {
  const { setFormValue, visibility } = useBoardCreateForm()
  const { icon, value, description } = item

  const isSelected = visibility === item.value

  const handleSelectVisibility = () => {
    setFormValue('visibility', item.value)
  }

  return (
    <div
      onClick={handleSelectVisibility}
      className={cn(
        'flex cursor-pointer items-center gap-4 px-2 py-2 hover:bg-gray-100',
        isSelected && 'bg-blue-100 hover:bg-blue-200'
      )}
    >
      <div className={cn('size-6 text-gray-700', isSelected && 'text-blue-600')}>{icon}</div>
      <div className='flex flex-col gap-1'>
        <span className={cn('tex-gray-700 text-sm', isSelected && 'text-blue-600')}>{value}</span>
        <p className={cn('text-xs text-gray-500', isSelected && 'text-blue-600')}>{description}</p>
      </div>
    </div>
  )
}

function VisibilityDropdown() {
  const { visibility } = useBoardCreateForm()

  const iconClasses = 'text-inherit'
  const visibilityItems: VisibilityItem[] = [
    {
      icon: <FaLock className={iconClasses} />,
      value: 'Private',
      description: boardVisibilityDescriptions.Private
    },
    {
      icon: <FaUserFriends className={iconClasses} />,
      value: 'Workspace',
      description: boardVisibilityDescriptions.Workspace
    },
    {
      icon: <RiEarthFill className={iconClasses} />,
      value: 'Public',
      description: boardVisibilityDescriptions.Public
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className='w-full flex-1'>
        <div className='flex w-full items-center justify-between rounded-sm border border-stone-500 bg-white px-3 py-2 text-sm'>
          {visibility}
          <FaAngleDown className='text-xs' />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className='w-full max-w-[300px]'>
        {visibilityItems.map((item, index) => (
          <DropdownMenu.Item key={index}>
            <VisibilitySelectionCard item={item} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export default VisibilityDropdown
