import DockLayout from '@/DockLayout.tsx'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DockLayout />
    </ThemeProvider>
  )
}

export default App
