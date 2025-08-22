import React from 'react'

type Props = {
  label: string
  description: string
  onClick?: () => void
}

function MainActionItem({ label, description, onClick }: Props) {
  const handleClickActionItem = () => {
    onClick && onClick()
  }

  return (
    <div className='w-full cursor-pointer rounded-sm px-4 py-2 hover:bg-gray-300' onClick={handleClickActionItem}>
      <span className='text-sm text-slate-600 underline'>{label}</span>
      <p className='mt-1 block text-xs text-slate-500 underline'>{description}</p>
    </div>
  )
}

export default MainActionItem
