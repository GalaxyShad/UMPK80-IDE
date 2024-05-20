import { create } from 'zustand'
import { Terminal } from '@xterm/xterm'

interface TranslatorState {
  translateCommand: string,
  terminal?: Terminal,
  fromAddress: number,

  setFromAddress: (address: number) => void,
  setTranslateCommand: (command: string) => void,
  setTerminal: (terminal: Terminal) => void
}

export const useTranslatorStore = create<TranslatorState>()((set) => ({
  terminal: undefined,
  translateCommand: localStorage.getItem('translateCommand') ?? 'i8080',
  fromAddress: 0x0800,

  setTerminal: (terminal: Terminal) => set({ terminal }),

  setFromAddress: (fromAddress: number) => set({ fromAddress }),

  setTranslateCommand: async (command: string) => {
      set({ translateCommand: command })
      localStorage.setItem('translateCommand', command)
  },
}))