import React from 'react'
import type { Tabs } from './types'

type Props = {
  tabName: Tabs
  text: string
  setTabFn: (val: Tabs) => void
}

function TabWrapper({ setTabFn, tabName, text }: Props) {
  const handleClickTab = () => {
    setTabFn && setTabFn(tabName)
  }

  return (
    <button type='button' className='rounded-lg bg-gray-300 px-4 py-2' onClick={handleClickTab}>
      <span className='block text-left text-sm'>{text}</span>
    </button>
  )
}

export default TabWrapper
