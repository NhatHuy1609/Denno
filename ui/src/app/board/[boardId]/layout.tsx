'use client'

import React from 'react'
import BoardLayoutComp from '@/layouts/BoardLayout'
import { usePageTypeAttribute } from '@/app/_hooks/dom/usePageTypeAttribute '

function DetailedBoardLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  usePageTypeAttribute('board')

  return (
    <>
      <BoardLayoutComp>{children}</BoardLayoutComp>
      {modal}
    </>
  )
}

export default DetailedBoardLayout
