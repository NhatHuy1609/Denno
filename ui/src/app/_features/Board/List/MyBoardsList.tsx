import React from 'react'
import { FaRegUser } from 'react-icons/fa6'
import BoardsList from './BoardsList'

function MyBoardsList() {
  return (
    <div className='w-full'>
      <div className='flex items-center gap-2'>
        <FaRegUser className='text-xl text-slate-700' />
        <span className='text-base font-bold text-slate-900'>Your boards</span>
      </div>
      <div className='mt-3 w-full'>
        <BoardsList />
      </div>
    </div>
  )
}

export default MyBoardsList
