import DockLayout from '@/DockLayout.tsx'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <DockLayout />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
