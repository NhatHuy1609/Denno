import React from 'react'
import { useParams } from 'next/navigation'
import { useBoardQuery } from '@/app/_hooks/query'
import PrimarySidebar from '../shared/PrimarySidebar'
import PrimaryHeader from '../shared/PrimaryHeader'

function BoardLayoutComp({
  showHeader = true,
  showSidebar = true,
  children
}: {
  showHeader?: boolean
  showSidebar?: boolean
  children: React.ReactNode
}) {
  const { boardId } = useParams()
  const { data: board } = useBoardQuery(boardId as string)

  return (
    <main
      style={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${board?.background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {showHeader && <PrimaryHeader />}
      <section className='max-w-screen relative z-[1] flex h-[calc(100%-var(--header-height))]'>
        {showSidebar && <PrimarySidebar />}
        <div className='h-full flex-1 overflow-x-auto'>{children}</div>
      </section>
    </main>
  )
}

export default BoardLayoutComp
