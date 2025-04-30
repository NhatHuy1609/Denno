import React from 'react'
import type { NotificationItemDisplay } from '../../helpers/types'
import { Avatar } from '@/ui'
import Link from 'next/link'

type Props = {
  content: NotificationItemDisplay['content']
}

function NotificationContent({ content }: Props) {
  const { initiator, description, date } = content

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
          <Link
            key={index}
            href={part.entity.url || ''}
            className='text-sm text-blue-500 hover:underline'
          >
            {part.entity.name}
          </Link>
        )
      }
    })
  }

  return (
    <div className='w-full bg-gray-100 px-1 py-2'>
      <div className='flex w-full items-center gap-2'>
        <Avatar size='sm' src={initiator.avatar} name='user-avatar' />
        <span className='text-sm font-bold'>{initiator.name}</span>
      </div>
      <div className='pl-8'>
        {renderDescription()}
        <div className='mt-1 text-xs text-slate-500'>{date}</div>
      </div>
    </div>
  )
}

export default NotificationContent
