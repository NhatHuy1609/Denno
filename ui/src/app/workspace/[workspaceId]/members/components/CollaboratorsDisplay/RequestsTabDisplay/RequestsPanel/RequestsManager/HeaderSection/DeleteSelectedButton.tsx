import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'

function DeleteSelectedButton() {
  return (
    <CustomizableButton
      disabled
      size='medium'
      intent='secondary'
      value='Delete selected requests'
    />
  )
}

export default DeleteSelectedButton
