import React from 'react'
import BoardPrimaryActions from './BoardPrimaryActions'
import BoardSecondaryActions from './BoardSecondaryActions'

function BoardContentHeader() {
  return (
    <header
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
      className='flex h-[var(--primary-sidebar-header-height)] w-full justify-between border-b border-[var(--ds-border-light-transparent)] border-l-transparent px-4 py-3'
    >
      <BoardPrimaryActions />
      <BoardSecondaryActions />
    </header>
  )
}

export default BoardContentHeader
