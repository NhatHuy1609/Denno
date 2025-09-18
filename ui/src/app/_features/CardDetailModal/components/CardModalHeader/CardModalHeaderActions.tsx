import { useRouter } from 'next/navigation'
import React from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'

function CardModalHeaderActions() {
  const router = useRouter()

  const handleCloseCardModal = () => {
    router.back()
  }

  return (
    <div className='flex gap-2'>
      <button
        onClick={handleCloseCardModal}
        className='flex size-8 items-center justify-center rounded-full hover:bg-gray-200'
        type='button'
      >
        <HiOutlineXMark className='text-lg' />
      </button>
    </div>
  )
}

export default CardModalHeaderActions
