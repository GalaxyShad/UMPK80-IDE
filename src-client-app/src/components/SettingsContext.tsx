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

export function SettingsContext({ children }: { children: React.ReactNode }) {
  const [isUsingCustomTranslatorPath, setIsUsingCustomTranslatorPath] = useState<boolean>(false)

  const [isOutputError, setIsOutputError] = useState<boolean>(false)
  const [output, setOutput] = useState<string>('')

  // const translatorCommand = useTranslatorStore((state) => state.translateCommand);
  // const setTranslatorCommand = useTranslatorStore((state) => state.setTranslateCommand);

  const [translatorCommand, setTranslatorCommand] = useState<string>(
    useTranslatorStore((state) => state.translateCommand),
  )

  const setStoreTranslatorCommand = useTranslatorStore((state) => state.setTranslateCommand)

  const selectFromDialog = async () => {
    const filePath = (await open({
      multiple: false,
    })) as string | null

    if (filePath !== null) setTranslatorCommand(filePath)
  }

  const trySetTranslatorCommand = async () => {
    const result = await setStoreTranslatorCommand(translatorCommand)

    setIsOutputError(!result.isSuccess)

    if (result.isSuccess) {
      console.log(result)
      setOutput(result.value)
    } else {
      setOutput(result.error ?? 'Unhandled error')
    }
  }

  return (
    <Dialog>
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
                setTranslatorCommand(x ? '' : 'i8080')
                setIsUsingCustomTranslatorPath(x)
              }}
              id="customPathCheckbox"
            />
            <Label htmlFor="customPathCheckbox">Использовать кастомный путь</Label>
          </div>
          {isUsingCustomTranslatorPath && (
            <div className="flex gap-2">
              <Input
                value={translatorCommand}
                onChange={(e) => setTranslatorCommand(e.target.value)}
                placeholder="Путь к исполняемому файлу"
              />
              <Button onClick={selectFromDialog} size="icon">
                <FolderOpen />
              </Button>
            </div>
          )}
          <Input
            className={isOutputError ? 'border-red-500' : ''}
            readOnly
            value={translatorCommand + ' -v'}
          />
          <div className={cn('border rounded px-2 py-2', isOutputError ? 'border-red-500' : '')}>
            {output}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={trySetTranslatorCommand} type="submit">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
