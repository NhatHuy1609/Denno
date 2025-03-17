import React from 'react'
import Image from 'next/image'
import DefaultEmptyBoardImage from 'public/default_empty_boards.png'
import CreateFirstBoardButton from './CreateFirstBoardButton'

function DefaultEmptyBoardSection() {
  return (
    <div className='mt-6 flex w-full flex-col items-center gap-4'>
      <Image
        src={DefaultEmptyBoardImage}
        alt='empty boards'
        className='w-[240px] select-none object-cover'
      />
      <p className='text-center text-sm text-gray-400'>
        Boards are where work gets done in Denno. On a board, you can move cards <br /> between
        lists to keep projects, tasks, and more on track.
      </p>
      <CreateFirstBoardButton />
    </div>
  )
}

export default DefaultEmptyBoardSection
