import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Label } from '@/components/ui/Label'
import { useState } from 'react'
import { useTranslatorStore } from '@/store/translator-store'
import { FolderOpen } from 'lucide-react'

import { open } from '@tauri-apps/api/dialog'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-menubar'
import { translatorGetVersion } from '@/services/translatorService.ts'

export function SettingsContext({ children }: { children: React.ReactNode }) {
  const translatorStoreCommand = useTranslatorStore(s => s.translateCommand)
  const translatorStoreSetCommand = useTranslatorStore(s => s.setTranslateCommand)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [path, setPath] = useState<string>(translatorStoreCommand)
  const [isUsingCustomTranslatorPath, setIsUsingCustomTranslatorPath] = useState<boolean>(path !== 'i8080')
  const [isOutputError, setIsOutputError] = useState<boolean | undefined>(undefined)
  const [output, setOutput] = useState<string>('')

  const selectFromDialog = async () => {
    const filePath = (await open({
      multiple: false,
    })) as string | null

    if (filePath !== null) {
      setPath(filePath)
    }
  }

  const test = async (): Promise<boolean> => {
    const result = await translatorGetVersion(path)

    setIsOutputError(!result.isSuccess)

    if (result.isSuccess) {
      setOutput(result.value)
    } else {
      setOutput(result.error ?? 'Unhandled error')
    }

    return result.isSuccess
  }

  const save = async () => {
    const res = await test()

    if (!res) return

    translatorStoreSetCommand(path)

    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Настройки пути транслятора</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={isUsingCustomTranslatorPath}
              onCheckedChange={(x: boolean) => {
                setPath(x ? '' : 'i8080')
                setIsUsingCustomTranslatorPath(x)
              }}
              id="customPathCheckbox"
            />
            <Label htmlFor="customPathCheckbox">Использовать абсолютный путь до транслятора</Label>
          </div>

          <div className="flex">
            <Input
              readOnly={!isUsingCustomTranslatorPath}
              className="rounded-r-none"
              value={path}
              onChange={(e) => isUsingCustomTranslatorPath && setPath(e.target.value.trim())}
              placeholder="Путь к исполняемому файлу"
            />
            <Button disabled={!isUsingCustomTranslatorPath} className="rounded-l-none px-2" variant="secondary"
                    onClick={selectFromDialog} size="icon">
              <FolderOpen className="text-foreground/25" />
            </Button>
          </div>

          <Separator />

          <div className="flex flex-row gap-2">
            <Input
              className={cn((isOutputError !== undefined) && (isOutputError ? 'border-red-500' : 'border-green-500'))}
              readOnly
              value={path + ' --version'}
            />
            <Button variant="secondary" onClick={test}>Выполнить</Button>
          </div>
          <div
            className={cn('min-h-24 border rounded px-2 py-2', (isOutputError !== undefined) && (isOutputError ? 'border-red-500' : 'border-green-500'))}>
            $ {output}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} type="submit">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
