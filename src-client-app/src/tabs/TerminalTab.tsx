import { useEffect, useRef } from 'react'
import { fitAddon, translatorTerminal } from '@/services/translatorTerminal.ts'

export default function TerminalTab() {
  const refDivTerminal = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refDivTerminal.current !== null) {
      translatorTerminal.open(refDivTerminal.current)

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit()
      })

      resizeObserver.observe(refDivTerminal.current)
    }
  }, [])

  return <div className="w-full h-full" ref={refDivTerminal} />
}
