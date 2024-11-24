import React from 'react'

function BoardContentHeader() {
  return (
    <header
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
      className='flex h-[var(--primary-sidebar-header-height)] w-full border-b border-[var(--ds-border-light-transparent)] border-l-transparent px-4 py-3'
    >
      <button className='rounded-[2px] px-2 text-lg font-semibold text-white hover:bg-white/40'>
        Wow
      </button>
    </header>
  )
}

export default BoardContentHeader
