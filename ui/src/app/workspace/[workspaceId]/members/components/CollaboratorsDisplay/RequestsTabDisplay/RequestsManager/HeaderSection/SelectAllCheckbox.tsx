import React from 'react'

function SelectAllCheckbox() {
  return (
    <div className='flex items-center gap-2'>
      <input type='checkbox' />
      <label>{`Select all (0)`}</label>
    </div>
  )
}

export default SelectAllCheckbox
