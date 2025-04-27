import React, { useRef, useState } from 'react'
import { getCssVariableValue } from '@/lib/styles/utils'
import { motion, useAnimate } from 'framer-motion'
import PrimarySidebarHeader from './PrimarySidebarHeader'
import PrimarySidebarNavLinks from './PrimarySidebarNavLinks'
import PrimarySidebarWorkspaceViews from './PrimarySidebarWorkspaceViews'
import PrimarySidebarUserBoardsByWorkspace from './PrimarySidebarUserBoardsByWorkspace'
import { FaAngleRight } from 'react-icons/fa6'

function ShowPrimarySidebarButton({ showSidebar }: { showSidebar: () => void }) {
  // Take header height pixel value
  const originalHeaderSidebarHeightPixelValue = getCssVariableValue(
    '--primary-sidebar-header-height'
  )
  // Take header height number value
  const headerSidebarHeightValue: number = +originalHeaderSidebarHeightPixelValue.slice(
    0,
    originalHeaderSidebarHeightPixelValue.length - 2
  )

  const handleShowSidebar = () => {
    showSidebar && showSidebar()
  }

  return (
    <button
      onClick={handleShowSidebar}
      style={{
        position: 'absolute',
        right: 0,
        top: `${headerSidebarHeightValue / 2}px`,
        transform: 'translate(50%, -50%)'
      }}
      className='flex size-6 items-center justify-center rounded-full border border-white'
    >
      <FaAngleRight className='text-sm text-white' />
    </button>
  )
}

function PrimarySidebar() {
  const [scope, animate] = useAnimate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const originalSidebarWidth = getCssVariableValue('--primary-sidebar-width') // px value

  const handleHideSidebar = () => {
    animate(
      scope.current,
      {
        width: '18px'
      },
      { duration: 0.1 }
    )

    if (containerRef?.current) {
      animate(containerRef.current, {
        x: -260
      })
    }

    setSidebarOpen(false)
  }

  const handleShowSidebar = () => {
    animate(
      scope.current,
      {
        width: originalSidebarWidth
      },
      {
        damping: 0,
        duration: 0.1
      }
    )

    if (containerRef?.current) {
      animate(
        containerRef.current,
        {
          x: 0
        },
        {
          damping: 0,
          duration: 0.1
        }
      )
    }

    setSidebarOpen(true)
  }

  return (
    <motion.aside
      ref={scope}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
      className='relative z-[100] h-[calc(100vh-var(--header-height))] w-[var(--primary-sidebar-width)] shrink-0 border-r border-[var(--ds-border-light-transparent)] text-white'
    >
      {!isSidebarOpen && <ShowPrimarySidebarButton showSidebar={handleShowSidebar} />}
      <div ref={containerRef} className='size-full'>
        <PrimarySidebarHeader hideSideboard={handleHideSidebar} />
        <div className='max-h-[calc(100%-var(--primary-sidebar-header-height))] overflow-y-auto'>
          <PrimarySidebarNavLinks />
          <PrimarySidebarWorkspaceViews />
          <PrimarySidebarUserBoardsByWorkspace />
        </div>
      </div>
    </motion.aside>
  )
}

export default PrimarySidebar
