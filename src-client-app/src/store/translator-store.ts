import { create } from 'zustand'
import { Terminal } from '@xterm/xterm'
import { join, resourceDir } from '@tauri-apps/api/path'

interface TranslatorState {
  defaultTranslateCommand: string;
  translateCommand: string,
  terminal?: Terminal,
  fromAddress: number,

  setDefaultTranslateCommand: (defaultTranslateCommand: string) => void,
  setFromAddress: (address: number) => void,
  setTranslateCommand: (command: string) => void,
  setTerminal: (terminal: Terminal) => void
}

const useTranslatorStore = create<TranslatorState>()((set) => ({
  terminal: undefined,
  translateCommand: localStorage.getItem('translateCommand') ?? 'i8080',
  fromAddress: 0x0800,
  defaultTranslateCommand: '',

  setTerminal: (terminal: Terminal) => set({ terminal }),

  setFromAddress: (fromAddress: number) => set({ fromAddress }),

  setDefaultTranslateCommand: (defaultTranslateCommand: string) => set({ defaultTranslateCommand, translateCommand: defaultTranslateCommand }),

  setTranslateCommand: async (command: string) => {
      set({ translateCommand: command })
      localStorage.setItem('translateCommand', command)
  },
}));

(async () => {
  const rd = await resourceDir()
  const defaultTranslateCommand = await join(rd, 'i8080')

  useTranslatorStore.setState({ defaultTranslateCommand })

  if (localStorage.getItem('translateCommand') === null) {
    useTranslatorStore.setState({ translateCommand: defaultTranslateCommand })
  }
})()

export { useTranslatorStore }