import React from 'react'
import { Popover } from '@/ui'

interface IHeaderInfo {
  component: React.ReactNode
  activeItem?: React.ReactNode
}

function HeaderInfoItem({ item }: { item: IHeaderInfo }) {
  const { component: TriggerComp, activeItem: ActiveComp } = item
  return (
    <Popover.Popover>
      <Popover.Trigger>
        <div className='flex size-8 items-center justify-center rounded-full hover:bg-[var(--ds-button-hovered)]'>
          {TriggerComp}
        </div>
      </Popover.Trigger>
      <Popover.Content align='end'>{ActiveComp}</Popover.Content>
    </Popover.Popover>
  )
}

function HeaderInfo({ infoList }: { infoList: IHeaderInfo[] }) {
  return (
    <div className='flex items-center gap-1'>
      {infoList.map((item, index) => (
        <HeaderInfoItem item={item} key={index} />
      ))}
    </div>
  )
}

export default HeaderInfo
