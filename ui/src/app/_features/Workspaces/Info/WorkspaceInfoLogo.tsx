import { useState } from 'react'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import { Popover } from '@/ui'
import WorkspaceInfoLogoUpdatePanel from './WorkspaceInfoLogoUpdatePanel'

export default function WorkspaceInfoLogo({
  logoUrl = '',
  name = ''
}: {
  logoUrl?: string | null
  name?: string
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleClosePopover = () => {
    setPopoverOpen(false)
  }

  return (
    <Popover.Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Popover.Trigger>
        <div className='group relative cursor-pointer rounded-sm border'>
          <WorkspaceLogo size='lg' imageUrl={logoUrl} name={name} />
          <div className='absolute bottom-0 hidden w-full bg-[rgba(0,0,0,0.2)] py-1 group-hover:block'>
            <span className='block w-full text-center text-sm font-semibold text-white underline'>
              Change
            </span>
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Content side='bottom'>
        <WorkspaceInfoLogoUpdatePanel onClickClosePopover={handleClosePopover} />
      </Popover.Content>
    </Popover.Popover>
  )
}
