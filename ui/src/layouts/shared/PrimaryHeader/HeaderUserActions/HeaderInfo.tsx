import React from 'react'
import { Popover } from '@/ui'
import { HeaderPopupItem } from '../types'

function HeaderInfoItem({ item }: { item: HeaderPopupItem }) {
  const { triggerItem, activeItem } = item
  return (
    <Popover.Popover>
      <Popover.Trigger>
        <div className='flex size-8 items-center justify-center rounded-full hover:bg-[var(--ds-button-hovered)]'>
          {triggerItem}
        </div>
      </Popover.Trigger>
      <Popover.Content align='end' className='w-fit'>
        {activeItem}
      </Popover.Content>
    </Popover.Popover>
  )
}

export default function HeaderInfo({ infoList }: { infoList: HeaderPopupItem[] }) {
  return (
    <div className='flex items-center gap-3'>
      {infoList.map((item, index) => (
        <HeaderInfoItem item={item} key={index} />
      ))}
    </div>
  )
}
