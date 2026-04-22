'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('afrodite-theme') as Theme | null
    const preferred = saved ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    applyTheme(preferred)
    setTheme(preferred)
  }, [])

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('afrodite-theme', t)
  }

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
