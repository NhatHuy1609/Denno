import React from 'react'
import BulkActionBar from './BulkActionBar'
import SelectAllCheckbox from './SelectAllCheckbox'

function HeaderSection() {
  return (
    <div className='my-3 flex w-full items-center justify-between border-b-2 border-gray-300 pb-3'>
      <SelectAllCheckbox />
      <BulkActionBar />
    </div>
  )
}

export default HeaderSection
