'use client'

import { useEffect, useRef, useState } from 'react'

import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

import '@xterm/xterm/css/xterm.css'
import { createTerminal, getTerminal } from '@/services/terminal'

export default function TerminalTab() {
  const refDivTerminal = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState<boolean>(true)

  // const [terminal, fitAddon] = getTerminal();

  useEffect(() => {
    console.log(refDivTerminal.current)

    const terminal = createTerminal()
    const fitAddon = new FitAddon()

    if (refDivTerminal.current !== null) {
      console.log(terminal.open)
      terminal.loadAddon(fitAddon)
      terminal.open(refDivTerminal.current)

      const resizeObserver = new ResizeObserver(() => {
        console.log('resize observer')
        fitAddon.fit()
      })

      resizeObserver.observe(refDivTerminal.current)
    }

    terminal.writeln('Welcome to UMPK-80 Emulator!!! Hope you will like it!')
    console.log({ terminal }, refDivTerminal.current)

    setLoading(false)

    return () => {
      console.log('Disposed')
      terminal.dispose()
    }
  }, [])

  return <div className="w-full h-full" ref={refDivTerminal} />
}
