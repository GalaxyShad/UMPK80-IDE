import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/tauri'
import { Err, Ok, Result } from '@/lib/result.ts'
import { Terminal } from '@xterm/xterm'

interface TranslatorState {
  translateCommand: string,
  terminal?: Terminal

  setTranslateCommand: (command: string) => Promise<Result<string>>,
  setTerminal: (terminal: Terminal) => void
}

export const useTranslatorStore = create<TranslatorState>()((set) => ({
  terminal: undefined,
  translateCommand: 'i8080',

  setTerminal: (terminal: Terminal) => set({ terminal }),

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