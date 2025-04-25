import React from 'react'
import AddSelectedButton from './AddSelectedButton'
import DeleteSelectedButton from './DeleteSelectedButton'

function BulkActionBar() {
  return (
    <div className='flex w-fit items-center gap-2'>
      <AddSelectedButton />
      <DeleteSelectedButton />
    </div>
  )
}

export default BulkActionBar
