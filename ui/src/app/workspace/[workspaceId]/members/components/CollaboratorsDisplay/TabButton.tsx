import React from 'react'
import { cn } from '@/lib/styles/utils'
import type { Tabs } from './types'
import { useSearchParams } from 'next/navigation'

type Props = {
  tabName: Tabs
  text: string
  setTabFn: (val: Tabs) => void
}

function TabButton({ setTabFn, tabName, text }: Props) {
  const searchParams = useSearchParams()
  const isTabActive = searchParams.get('tab') === tabName

  const handleClickTab = () => {
    setTabFn && setTabFn(tabName)
  }

  return (
    <button
      type='button'
      className={cn(
        'rounded-lg px-4 py-2 font-medium hover:bg-gray-300',
        isTabActive && 'bg-blue-100 text-blue-600'
      )}
      onClick={handleClickTab}
    >
      <span className='block text-left text-sm'>{text}</span>
    </button>
  )
}

export default TabButton
