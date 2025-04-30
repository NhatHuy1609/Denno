import React from 'react'
import { Popover } from '@/ui'
import { HeaderPopupItem } from './types'

function HeaderInfoItem({ item }: { item: HeaderPopupItem }) {
  const { triggerItem: TriggerComp, activeItem: ActiveComp } = item
  return (
    <Popover.Popover>
      <Popover.Trigger>
        <div className='flex size-8 items-center justify-center rounded-full hover:bg-[var(--ds-button-hovered)]'>
          {TriggerComp}
        </div>
      </Popover.Trigger>
      <Popover.Content align='end' className='w-fit'>
        {ActiveComp}
      </Popover.Content>
    </Popover.Popover>
  )
}

function HeaderInfo({ infoList }: { infoList: HeaderPopupItem[] }) {
  return (
    <div className='flex items-center gap-1'>
      {infoList.map((item, index) => (
        <HeaderInfoItem item={item} key={index} />
      ))}
    </div>
  )
}

export default HeaderInfo
