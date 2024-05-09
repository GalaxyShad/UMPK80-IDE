import UmpkKeyboard from '@/components/umpk/UmpkKeyboard.tsx'
import UmpkIOPortOutput from '@/components/umpk/UmpkIOOutput.tsx'
import UmpkIOPortInput from '@/components/umpk/UmpkIOPortInput.tsx'
import UmpkRegistersControl from '@/components/umpk/UmpkRegistersControl.tsx'
import UmpkDisplay from '@/components/umpk/UmpkDisplay.tsx'
import UmpkFlags from '@/components/umpk/UmpkFlags.tsx'
import UmpkSpeakerControl from '@/components/umpk/UmpkSpeakerControl.tsx'

import { useUmpkRealKeyboardBindings } from '@/hooks/useUmpkRealKeyboardBindings.tsx'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils.ts'


export default function UmpkTab() {
  const [refUmpk, handleKeyDown, handleKeyUp, pressedKeys] = useUmpkRealKeyboardBindings()
  const [numColumns, setNumColumns] = useState<number>(2)

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (refUmpk.current?.offsetWidth)
        setNumColumns((refUmpk.current?.offsetWidth > 400) ? 2 : 1)
    })

    if (refUmpk.current)
      observer.observe(refUmpk.current)

    return () => observer.disconnect()
  }, [refUmpk])

  return (
    <div
      className="h-full w-full"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={refUmpk}>
      <div
        className={cn('grid grid-cols-2 gap-y-4 gap-x-4 px-4 py-4 w-full items-center', `grid-cols-${numColumns}`)}
      >
        <UmpkDisplay className={cn(numColumns === 2 && 'col-span-2')} />

        <UmpkFlags />
        <UmpkSpeakerControl />

        <UmpkRegistersControl />
        <div className="grid grid-rows-3 gap-2 h-full w-full">
          <div className="flex h-full border rounded text-secondary justify-center items-center text-center min-h-16">
            UMPK80-IDE<br /> by @GalaxyShad 2024
          </div>
          <UmpkIOPortOutput />
          <UmpkIOPortInput />
        </div>

        <UmpkKeyboard pressedKeys={pressedKeys} />
      </div>
    </div>
  )
}



