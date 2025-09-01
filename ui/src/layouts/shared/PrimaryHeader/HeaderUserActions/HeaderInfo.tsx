import React from 'react'
import { Popover } from '@/ui'
import { HeaderPopupItem } from '../types'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'

function HeaderInfoItem({ item }: { item: HeaderPopupItem }) {
  const { triggerItem, activeItem } = item
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <button
          type='button'
          className='flex size-8 items-center justify-center rounded-full hover:bg-[var(--ds-button-hovered)]'
        >
          {triggerItem}
        </button>
      )}
      renderContent={() => activeItem}
      contentConfigs={{
        align: 'end'
      }}
      contentClassName='w-fit p-0'
    />
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
