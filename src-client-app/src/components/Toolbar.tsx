import { Button, ButtonProps } from '@/components/ui/Button'
import { File, FolderOpen, Hammer, Lightbulb, Play, RedoDot, Save, Square } from 'lucide-react'
import { open, save } from '@tauri-apps/api/dialog'
import { useEditorStore } from '@/store/editor-store'
import {
  loadSourceCodeFromFile,
  saveSourceCodeToFile,
  translateAndBuild,
  translateTo,
  TranslateToType,
} from '@/services/translatorService.ts'
import { Switch } from '@/components/ui/Switch.tsx'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils.ts'
import { useTheme } from '@/components/ThemeProvider.tsx'
import { useTranslatorStore } from '@/store/translator-store.ts'
import { HexInput } from '@/components/ui/HexInput.tsx'
import { useUMPK80Store } from '@/store/umpkStore.ts'
import { KeyboardKey } from '@/services/umpkService.ts'

function useToolbarActions() {
  const editorSourceCode = useEditorStore(s => s.sourceCode)
  const setEditorSourceCode = useEditorStore(s => s.setSourceCode)

  const terminal = useTranslatorStore(s => s.terminal)
  const fromAddress = useTranslatorStore(s => s.fromAddress)
  const setFromAddress = useTranslatorStore(s => s.setFromAddress)
  const translatorPath = useTranslatorStore(s => s.translateCommand)

  const umpkRun = useUMPK80Store(s => s.runFromAddress)
  const umpkPressKey = useUMPK80Store(s => s.pressKey)
  const umpkReleaseKey = useUMPK80Store(s => s.releaseKey)


  const sourceCodeExportTo = async (type: TranslateToType) => {
    const result = await translateTo(type, editorSourceCode, translatorPath)

    if (!result.isSuccess) {
      terminal?.writeln('\x1b[31m' + result.error + '\n')
    }
  }

  const onFromAddressChange = (x: number) => {
    setFromAddress(x)
  }

  const buildClick = async () => {
    const result = await translateAndBuild(editorSourceCode, translatorPath, fromAddress - 0x0800)

    if (result.isSuccess) {
      terminal?.writeln(result.value.binaryExists
        ? `\x1b[32m${result.value.stdout}\n`
        : `\x1b[31m${result.value.stderr}\n`)
    } else {
      terminal?.writeln('\x1b[31m' + result.error + '\n')
    }
  }

  const playClick = async () => {
    await buildClick()
    await umpkRun(fromAddress)
  }

  const stepClick = async () => {
    await umpkPressKey(KeyboardKey.SHK)
    await umpkReleaseKey(KeyboardKey.SHK)
  }

  const stopClick = async () => {
    await umpkPressKey(KeyboardKey.ST)
    await umpkReleaseKey(KeyboardKey.ST)
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

  return {
    playClick,
    stepClick,
    stopClick,
    buildClick,
    openClick,
    saveClick,
    onFromAddressChange: onFromAddressChange,
    fromAddress,
    sourceCodeExportTo
  }
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
  const {
    openClick,
    stepClick,
    stopClick,
    buildClick,
    saveClick,
    playClick,
    onFromAddressChange,
    fromAddress,
    sourceCodeExportTo
  } = useToolbarActions()

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
        <HexInput className="max-h-6 w-16" minValue={0x0800} bytesLen={2} onBlur={onFromAddressChange}
                  value={fromAddress} />
        <ToolbarButton>
          <Hammer onClick={buildClick} size={16} className="text-gray-300" />
        </ToolbarButton>
        <ToolbarButton onClick={playClick}>
          <Play size={16} className="text-green-400" />
        </ToolbarButton>
        <ToolbarButton>
          <Square onClick={stopClick} size={16} className="text-red-400" />
        </ToolbarButton>
        <ToolbarButton>
          <RedoDot onClick={stepClick} size={16} className="text-blue-400" />
        </ToolbarButton>
      </span>

      <span className="flex flex-row gap-1">
        <ToolbarButton onClick={() => sourceCodeExportTo('docx')} className="w-fit border px-2">
          <p className="text-[10px] text-blue-800">DOCX</p>
        </ToolbarButton>
        <ToolbarButton onClick={() => sourceCodeExportTo('csv')} className="w-fit border px-2">
          <p className="text-[10px] text-green-600 my-auto">CSV</p>
        </ToolbarButton>
        <ToolbarButton onClick={() => sourceCodeExportTo('markdown')} className="w-fit border px-2">
          <p className="text-[10px] text-red-500">MD</p>
        </ToolbarButton>
        <ToolbarButton onClick={() => sourceCodeExportTo('txt')} className="w-fit border px-2">
          <p className="text-[10px] text-zinc-600">TXT</p>
        </ToolbarButton>
      </span>

      <span className="flex flex-row gap-1 items-center">
        <Lightbulb className="text-white/25" size={16} />
        <Switch onCheckedChange={(checked) => setTheme((checked) ? 'light' : 'dark')} />
      </span>
    </div>
  )
}

