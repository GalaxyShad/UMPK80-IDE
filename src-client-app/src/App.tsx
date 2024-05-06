import DockLayout from '@/DockLayout.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DockLayout />
    </ThemeProvider>
  )
}

export default App
