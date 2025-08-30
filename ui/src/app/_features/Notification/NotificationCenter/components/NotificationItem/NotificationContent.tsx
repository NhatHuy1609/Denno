import React from 'react'
import type { NotificationItemDisplay } from '../../helpers/types'
import { Avatar } from '@/ui'
import Link from 'next/link'
import CustomizableButton from '@/ui/components/CustomizableButton'

type Props = {
  content: NotificationItemDisplay['content']
}

function NotificationContent({ content }: Props) {
  const { initiator, description, date, actionButton } = content

  const renderDescription = () => {
    return description.map((part, index) => {
      if (part.type === 'text') {
        return (
          <span key={index} className='text-sm'>
            {part.content}
          </span>
        )
      }

      if (part.type === 'entity') {
        return (
          <Link key={index} href={part.entity.url || ''} className='text-sm text-blue-600 hover:underline'>
            {part.entity.name}
          </Link>
        )
      }
    })
  }

  return (
    <div className='w-full bg-gray-100 p-2'>
      <div className='flex w-full items-center gap-2'>
        <Avatar size='sm' src={initiator.avatar} name='user-avatar' />
        <span className='text-sm font-bold'>{initiator.name}</span>
      </div>
      <div className='pl-8'>
        <div className='w-fit'>{renderDescription()}</div>
        <div className='mt-1 text-xs text-slate-500'>{date}</div>
        {actionButton && (
          <div className='mt-2 w-fit'>
            <CustomizableButton
              intent='secondary'
              size='medium'
              value={actionButton.text}
              onClick={actionButton.onClick}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationContent
