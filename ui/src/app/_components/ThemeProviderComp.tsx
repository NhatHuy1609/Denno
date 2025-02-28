import React from 'react'
import { ThemeProvider } from 'next-themes'

function ThemeProviderComp({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='data-theme' defaultTheme='light'>
      {children}
    </ThemeProvider>
  )
}

export default ThemeProviderComp
