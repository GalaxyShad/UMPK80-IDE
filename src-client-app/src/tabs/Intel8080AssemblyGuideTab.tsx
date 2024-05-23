import { useTheme } from '@/components/ThemeProvider.tsx'
import { cn } from '@/lib/utils.ts'

export default function Intel8080AssemblyGuideTab() {
  const { theme } = useTheme()

  return (
    <div className="flex h-full w-full">
      <iframe
        className={cn(theme === 'dark' && "invert")}
        src="https://altairclone.com/downloads/manuals/8080%20Programmers%20Manual.pdf"
        content="application/pdf"
        width="100%"
        height="100%"
      />
    </div>
  )
}