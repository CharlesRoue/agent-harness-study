import { createContext, useContext, type ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'

type ThemeReturn = ReturnType<typeof useTheme>
type ProgressReturn = ReturnType<typeof useProgress>

interface AppContextType {
  theme: ThemeReturn
  progress: ProgressReturn
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const progress = useProgress()
  return (
    <AppContext.Provider value={{ theme, progress }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
