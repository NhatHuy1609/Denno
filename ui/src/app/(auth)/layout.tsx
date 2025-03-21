import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='relative h-[125vh] w-full bg-stone-50'>
      <div className='relative flex h-full w-full items-center justify-center overflow-hidden'>
        <div className='absolute bottom-[-50vh] h-[100vh] w-[120%] rotate-[25deg] rounded-full bg-gradient-to-r from-red-500 to-cyan-500'></div>
        <div className='absolute bottom-[-50vh] h-[100vh] w-[120%] rotate-[-25deg] rounded-full bg-gradient-to-r from-cyan-500 to-yellow-500'></div>
        <div className='absolute bottom-[-50vh] h-[100vh] w-[120%] rotate-[8deg] rounded-full bg-gradient-to-r from-cyan-500 to-yellow-500'></div>
        <div className='absolute bottom-[-50vh] h-[100vh] w-[120%] rotate-[-8deg] rounded-full bg-gradient-to-r from-cyan-300 to-blue-600'></div>
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
