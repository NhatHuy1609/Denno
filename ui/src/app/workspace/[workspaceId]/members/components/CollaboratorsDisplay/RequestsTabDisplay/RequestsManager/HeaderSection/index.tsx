import React from 'react'
import BulkActionBar from './BulkActionBar'
import SelectAllCheckbox from './SelectAllCheckbox'

function HeaderSection() {
  return (
    <div className='my-3 flex w-full items-center justify-between'>
      <SelectAllCheckbox />
      <BulkActionBar />
    </div>
  )
}

export default HeaderSection
