import { useEffect, useState } from 'react'
import HexEditor from '@/tabs/HexEditor.tsx'
import { umpkGetROM } from '@/services/umpkService.ts'

export default function UmpkRomTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array())

  useEffect(() => {
    const f = async () => {
      const rom = await umpkGetROM()

      setMemory(rom)
    }

    f()
  }, [])

  return (
    <div className="flex h-full w-full">
      <HexEditor readonly memory={memory} />
    </div>
  )
}