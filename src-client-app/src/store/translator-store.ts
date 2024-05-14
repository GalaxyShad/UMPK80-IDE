import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/tauri'
import { Err, Ok, Result } from '@/lib/result.ts'
import { Terminal } from '@xterm/xterm'

interface TranslatorState {
  translateCommand: string,
  terminal?: Terminal,
  fromAddress: number,

  setFromAddress: (address: number) => void,
  setTranslateCommand: (command: string) => Promise<Result<string>>,
  setTerminal: (terminal: Terminal) => void
}

export const useTranslatorStore = create<TranslatorState>()((set) => ({
  terminal: undefined,
  translateCommand: localStorage.getItem('translateCommand') ?? 'i8080',
  fromAddress: 0x0800,

  setTerminal: (terminal: Terminal) => set({ terminal }),

  setFromAddress: (fromAddress: number) => set({ fromAddress }),

  setTranslateCommand: async (command: string): Promise<Result<string>> => {
    try {
      set({ translateCommand: command })
      localStorage.setItem('translateCommand', command)

      return Ok('Ok')
    } catch (e) {
      return Err(e as string)
    }
  },
}))