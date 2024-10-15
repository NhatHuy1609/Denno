import React from 'react'
import { ThemeProvider } from 'next-themes'

function ThemeProviderComp({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      {children}
    </ThemeProvider>
  )
}

export default ThemeProviderComp
