import { Button, ButtonProps } from '@/components/ui/Button'
import { File, FolderOpen, Hammer, Lightbulb, Play, RedoDot, Save, Square } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { open, save } from '@tauri-apps/api/dialog'
import { useEditorStore } from '@/store/editor-store'
import { ExportToWordIcon } from '@/assets/ExportToWordIcon.tsx'
import { loadSourceCodeFromFile, saveSourceCodeToFile, translateAndRun } from '@/services/translatorService.ts'
import { Switch } from '@/components/ui/Switch.tsx'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils.ts'
import { useTheme } from '@/components/ThemeProvider.tsx'
import { useTranslatorStore } from '@/store/translator-store.ts'

function useToolbarActions() {
  const editorSourceCode = useEditorStore(s => s.sourceCode)
  const setEditorSourceCode = useEditorStore(s => s.setSourceCode)
  const terminal = useTranslatorStore(s => s.terminal)


  const playClick = async () => {
    const result = await translateAndRun(editorSourceCode)

    terminal?.writeln(result.isSuccess ? result.value[0] : result.error)
  }

  const openClick = async () => {
    const filePath = await open({
      multiple: false,
      filters: [
        {
          name: 'Assembly source code',
          extensions: ['asm'],
        },
      ],
    })

    const result = await loadSourceCodeFromFile(filePath as string)

    if (!result.isSuccess) {
      terminal?.writeln(result.error)
      return
    }

    setEditorSourceCode(result.value)
  }

  const saveClick = async () => {
    const filePath = await save({
      filters: [
        {
          name: 'Assembly source code',
          extensions: ['asm'],
        },
      ],
    })

    if (filePath === null) {
      return
    }

    const result = await saveSourceCodeToFile(filePath, editorSourceCode)

    if (!result.isSuccess) {
      terminal?.writeln(result.error)
    }
  }

  return { playClick, openClick, saveClick }
}


const ToolbarButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) =>
    (<Button
      ref={ref}
      className={cn('h-6 w-6', className)}
      variant="ghost"
      size="icon"
      {...props}
    >
      {children}
    </Button>),
)

export default function Toolbar() {
  const { openClick, saveClick, playClick } = useToolbarActions()

  const { setTheme } = useTheme()

  return (
    <div className="flex flex-row py-1 px-2 gap-4 justify-between">
      <span className="flex flex-row gap-1">
        <ToolbarButton>
          <File size={16} className="text-white" />
        </ToolbarButton>
        <ToolbarButton>
          <FolderOpen onClick={openClick} size={16} className="text-yellow-400" />
        </ToolbarButton>
        <ToolbarButton>
          <Save onClick={saveClick} size={16} className="text-violet-600" />
        </ToolbarButton>
      </span>

      <span className="flex flex-row gap-1">
        <Input className="max-h-6 w-16" defaultValue={2048} />
        <ToolbarButton>
          <Hammer size={16} className="text-gray-300" />
        </ToolbarButton>
        <ToolbarButton onClick={playClick}>
          <Play size={16} className="text-green-400" />
        </ToolbarButton>
        <ToolbarButton>
          <Square size={16} className="text-red-400" />
        </ToolbarButton>
        <ToolbarButton>
          <RedoDot size={16} className="text-blue-400" />
        </ToolbarButton>
      </span>

      <span className="flex flex-row gap-1">
        <ToolbarButton>
          <ExportToWordIcon />
        </ToolbarButton>
      </span>

      <span className="flex flex-row gap-1 items-center">
        <Lightbulb className="text-white/25" size={16} />
        <Switch onCheckedChange={(checked) => setTheme((checked) ? 'light' : 'dark')} />
      </span>
    </div>
  )
}

