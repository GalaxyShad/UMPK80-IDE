// import { docIntel8080Commands } from '@/assets/docIntel8080Commands.ts'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { cn } from '@/lib/utils'

import { default as docIntel8080Commands } from '@/assets/docCommands.json'
import { Input } from '@/components/ui/Input.tsx'
import { useEffect, useRef, useState } from 'react'

const GroopCommand = {
  ['Undocumented']: 'text-zinc-400',
  ['Misc']: 'text-purple-400',
  ['Jumps']: 'text-orange-400',
  ['8bit load']: 'text-blue-400',
  ['16bit load']: 'text-green-400',
  ['8bit arithmetic']: 'text-yellow-400',
  ['16bit arithmetic']: 'text-pink-400',
} as Record<string, string>

const commands = Array(256).fill(0).map((_, i) => docIntel8080Commands.find(x => +('0x' + x.hexOpcode) === i) ?? {
  hexOpcode: '-',
  decimalOpcode: '',
  binaryOpcode: '',
  mnemonic: '-',
  argument1: '',
  argument2: '',
  cycles: '',
  mask: '',
  flags: '',
  tags: '',
  bytesCount: '1',
  flagsAffected: [],
  functionDescription: '',
  rusDescription: '',
})

export function Intel8080CommandsTab() {
  const tabRef = useRef<HTMLDivElement | null>(null)
  const [compactMode, setCompactMode] = useState<boolean>(false)

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setCompactMode((tabRef?.current?.offsetWidth ?? 0) > 520)
    })

    if (tabRef.current)
      observer.observe(tabRef.current)

    return () => observer.disconnect()
  }, [tabRef])

  return (
    <div className="w-full h-full" ref={tabRef}>
      {!compactMode && <Intel8080CommandsList/>}
      {compactMode && <Intel8080CommandsTable/>}
    </div>
  )
}

function Intel8080CommandsTable() {
  return (
    <div className="overflow-auto min-w-[1400px]">
      <div className="grid grid-cols-16 w-full font-mono">
        {Array(16).fill(0).map((_, i) => (<div key={i} className="flex text-center justify-center">{i.toHexString()}</div>))}
      </div>
      <div className="grid grid-cols-16 w-full font-mono">
        {commands.map(x => (
          <Tooltip key={x.hexOpcode} delayDuration={0} disableHoverableContent>
            <TooltipTrigger>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div
                      className={cn(GroopCommand[x.tags[0]], 'border flex text-center justify-center items-center px-1 w-full h-full m-auto')}>
                      {cn(x.mnemonic, [x.argument1, x.argument2].filter(y => y).join(','))}
                    </div>
                  </div>
                  <div className="flip-card-back flex justify-center items-center">
                    {x.hexOpcode}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent alignOffset={64} align="start" className="min-w-48 max-w-96 border-primary/50">
              <div className="flex flex-row gap-2">
                <div className="mb-2 font-bold">
                  {x.mnemonic} {[x.argument1, x.argument2].filter(y => y).join(',')}
                </div>
                <div>
                  ({x.hexOpcode})
                </div>
              </div>
              <div>
                {x.functionDescription}
              </div>
              <div>
                Влияет на флаги: {x.flagsAffected.length !== 0 ? x.flagsAffected.join(' ') : '-'}
              </div>
              <div>
                Описание: {x.rusDescription}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

function Intel8080CommandsList() {
  const [searchString, setSearchString] = useState<string>('')

  const filteredCommands = searchString === ''
    ? commands
    : commands.filter(x => {
      const s = [x.hexOpcode, x.mnemonic, x.argument1, x.argument2].join(' ').toUpperCase()

      return s.includes(searchString.toUpperCase())
    })

  return (
    <div className="w-full h-full flex flex-col px-2 py-1">
      <Input value={searchString} onChange={(x) => setSearchString(x.target.value)}
             placeholder="Введите описание или название инструкции" className="my-2 min-h-8 h-8"></Input>
      <div className="overflow-y-scroll font-mono">
        {filteredCommands.map(x =>
          <div className="border px-2 py-2" key={x.hexOpcode}>
            <div className="flex flex-row justify-between items-center">
              <div
                className={cn(GroopCommand[x.tags[0]])}>[{x.hexOpcode}] {x.mnemonic} {[x.argument1, x.argument2].filter(x => x).join(',')}</div>
              <div
                className="text-sm text-foreground/50 max-w-[150px]">{x.flagsAffected.length !== 0 ? x.flagsAffected.join(' ') : '-'}</div>
            </div>
            <div className="text-foreground/50 text-sm mt-2">
              {x.functionDescription}
            </div>
          </div>,
        )}
      </div>
    </div>
  )
}