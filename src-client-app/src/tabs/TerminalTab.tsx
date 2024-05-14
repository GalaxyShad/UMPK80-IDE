import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useTranslatorStore } from '@/store/translator-store.ts'

export default function TerminalTab() {
  const refDivTerminal = useRef<HTMLDivElement>(null)

  const setTerminal = useTranslatorStore(s => s.setTerminal)

  useEffect(() => {
    const translatorTerminal = new Terminal({
      theme: {
        background: '#fdf6e300',
      },
      convertEol: true
    })

    if (refDivTerminal.current !== null) {
      const fitAddon = new FitAddon()

      translatorTerminal.loadAddon(fitAddon)
      translatorTerminal.open(refDivTerminal.current)

      translatorTerminal.writeln('Welcome to UMPK-80 Emulator!!! Hope you will like it!')

      const resizeObserver = new ResizeObserver(() => {
        fitAddon?.fit()
      })

      resizeObserver.observe(refDivTerminal.current)

      setTerminal(translatorTerminal)
    }

    return () => {
      translatorTerminal.dispose()
    }
  }, [setTerminal])

  return <div className="w-full h-full" ref={refDivTerminal} />
}
