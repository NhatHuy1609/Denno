import React, { useEffect, useState } from 'react'

type Props = {
  isSelected?: boolean
  requestId: number
  selectRequestFn: (requestId: number) => void
}

function SelectRequestCheckbox({ requestId, selectRequestFn, isSelected = false }: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(isSelected)

  useEffect(() => {
    setIsChecked(isSelected)
  }, [isSelected])

  const handleSelectRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectRequestFn(requestId)
    setIsChecked(event.target.checked)
  }

  return (
    <input checked={isChecked} type='checkbox' className='size-4' onChange={handleSelectRequest} />
  )
}

export default SelectRequestCheckbox
