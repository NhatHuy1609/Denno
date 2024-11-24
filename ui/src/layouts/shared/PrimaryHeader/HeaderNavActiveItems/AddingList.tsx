import dynamic from 'next/dynamic'
import React, { ReactNode, useState } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { HiViewBoards } from 'react-icons/hi'
import { BsPersonWorkspace } from 'react-icons/bs'
import { LiaAngleLeftSolid } from 'react-icons/lia'
import WorkspaceCreateForm from '@/app/_features/Workspaces/Create/WorkspaceCreateForm'
import DefaultLazyFallbackComp from '@/app/_components/DefaultLazyFallbackComp'

// Lazy loading components
const BoardCreateForm = dynamic(() => import('@/app/_features/Board/CreateForm'), {
  ssr: false,
  loading: () => <DefaultLazyFallbackComp className='w-[300px]' />
})

interface IItem {
  title: string
  icon?: ReactNode
  description?: string
  activeContent?: ReactNode
  childs?: IItem[]
}

function AddingItem({ item, onClick }: { item: IItem; onClick: () => void }) {
  const { icon, description, title } = item

  return (
    <div onClick={onClick} className='cursor-pointer rounded-md bg-white p-2 hover:bg-gray-200'>
      <div className='vertical-align inline-flex items-center gap-2'>
        {icon}
        <span className='text-sm text-black'>{title}</span>
      </div>
      <p className='text-xs text-gray-500'>{description}</p>
    </div>
  )
}

function AddingChildWrapper({
  children,
  title,
  onBackHistory
}: {
  children: ReactNode
  title: string
  onBackHistory: () => void
}) {
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <span
          className='cursor-pointer rounded-md p-2 hover:bg-gray-200'
          onClick={() => onBackHistory()}
        >
          <LiaAngleLeftSolid className='text-sm' />
        </span>
        <span className='text-sm font-medium text-slate-800'>{title}</span>
        <span className='cursor-pointer rounded-md p-2 hover:bg-gray-200'>
          <HiXMark className='text-sm' />
        </span>
      </div>
      {children}
    </div>
  )
}

export default function AddingListContainer() {
  const [selectedItemHistory, setSelectedItemHistory] = useState<IItem[]>([])

  const currentSelectedItem = selectedItemHistory[selectedItemHistory.length - 1]

  const itemList: Array<IItem> = [
    {
      title: 'Create workspace',
      icon: <BsPersonWorkspace className='text-sm text-gray-600' />,
      description:
        'A workspace is where teams collaborate and organize boards, making it easy to manage projects and track progress in one place.',
      activeContent: <WorkspaceCreateForm />,
      childs: []
    },
    {
      title: 'Create board',
      icon: <HiViewBoards className='text-sm text-gray-600' />,
      description:
        'A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.',
      activeContent: <BoardCreateForm />,
      childs: []
    }
  ]

  const handleShowSelectedItem = (item: IItem) => {
    setSelectedItemHistory((prev) => [...prev, item])
  }

  const handleBack = () => {
    setSelectedItemHistory((prev) => {
      const newHistory = [...prev]
      newHistory.pop()
      return newHistory
    })
  }

  const renderInitialList = () => {
    return (
      <div className='flex max-w-[300px] flex-col gap-1'>
        {itemList.map((item, index) => (
          <AddingItem onClick={() => handleShowSelectedItem(item)} key={index} item={item} />
        ))}
      </div>
    )
  }

  const renderSelectedContent = () => {
    if (!currentSelectedItem) return null

    const { title, activeContent: ActiveContent, childs = [] } = currentSelectedItem

    return (
      <AddingChildWrapper onBackHistory={handleBack} title={title}>
        {ActiveContent}
        {childs.length > 0 &&
          childs.map((child, index) => (
            <AddingItem key={index} item={child} onClick={() => handleShowSelectedItem(child)} />
          ))}
      </AddingChildWrapper>
    )
  }

  return (
    <div className='max-w-[450px]'>
      {currentSelectedItem ? renderSelectedContent() : renderInitialList()}
    </div>
  )
}
