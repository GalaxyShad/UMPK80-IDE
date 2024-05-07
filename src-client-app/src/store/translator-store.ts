import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/tauri'
import { Err, Ok, Result } from '@/lib/result.ts'

interface TranslatorState {
  translateCommand: string,

  setTranslateCommand: (command: string) => Promise<Result<string>>,
}

export const useTranslatorStore = create<TranslatorState>()((set) => ({
  translateCommand: 'i8080',
  setTranslateCommand: async (command: string): Promise<Result<string>> => {
    try {
      const result = await invoke('translator_set_execution_command', { command })

      set(state => ({ ...state, translateCommand: command }))

      return Ok(result as string)
    } catch (e) {
      return Err(e as string)
    }
  },
}))