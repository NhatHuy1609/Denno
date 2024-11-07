import { ReactNode } from 'react'
import { cn } from '@/lib/styles/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LuCheck } from 'react-icons/lu'

export default function DropdownMenuContainer({
  children
}: {
  children: ReactNode
}) {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>
}

const DropdownTrigger = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <DropdownMenu.Trigger className={className}>
      {children}
    </DropdownMenu.Trigger>
  )
}

const DropdownContent = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={10}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

const DropdownItem = ({
  children,
  className
}: {
  inset?: boolean
  children: ReactNode
  className?: string
}) => {
  return (
    <DropdownMenu.Item
      className={cn('outline-none hover:outline-none', className)}
    >
      {children}
    </DropdownMenu.Item>
  )
}

const DropdownCheckboxItem = ({
  children,
  className,
  checked
}: {
  children: ReactNode
  className?: string
} & Pick<DropdownMenu.DropdownMenuCheckboxItemProps, 'checked'>) => {
  return (
    <DropdownMenu.CheckboxItem
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      checked={checked}
    >
      <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <DropdownMenu.ItemIndicator>
          <LuCheck className='h-4 w-4' />
        </DropdownMenu.ItemIndicator>
      </span>
      {children}
    </DropdownMenu.CheckboxItem>
  )
}

const DropdownLabel = ({
  title,
  className
}: {
  title: string
  className?: string
}) => {
  return (
    <DropdownMenu.Label
      className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    >
      {title}
    </DropdownMenu.Label>
  )
}

const DropdownSeparator = ({ className }: { className?: string }) => {
  return (
    <DropdownMenu.Separator
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
    />
  )
}

DropdownMenuContainer.Trigger = DropdownTrigger
DropdownMenuContainer.Content = DropdownContent
DropdownMenuContainer.Item = DropdownItem
DropdownMenuContainer.Label = DropdownLabel
DropdownMenuContainer.Separator = DropdownSeparator
DropdownMenuContainer.CheckboxItem = DropdownCheckboxItem
