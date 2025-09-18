import React from 'react'

type Props = {
  label: string
  children: React.ReactNode
}

function DetailSectionWrapper({ label, children }: Props) {
  return (
    <div className='flex flex-col gap-1'>
      <h4 className='text-xs font-semibold text-gray-600'>{label}</h4>
      <div className='w-auto'>{children}</div>
    </div>
  )
}

export default DetailSectionWrapper
