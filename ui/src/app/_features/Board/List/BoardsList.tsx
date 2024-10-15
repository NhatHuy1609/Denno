import React from 'react'
import BoardsItem from './BoardsItem'

function BoardsList() {
  return (
    <div className='grid grid-cols-4 gap-4'>
      <BoardsItem />
      <BoardsItem />
      <BoardsItem />
      <BoardsItem />
      <BoardsItem />
      <BoardsItem />
    </div>
  )
}

export default BoardsList
