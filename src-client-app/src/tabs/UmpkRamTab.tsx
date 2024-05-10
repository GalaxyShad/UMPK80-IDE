import { useEffect, useState } from 'react'
import HexEditor from '@/tabs/HexEditor.tsx'
import { umpkGetRAM, umpkWriteToMemory } from '@/services/umpkService.ts'


export default function UmpkRamTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array(2048))

  const f = async () => {
    const umpkRam = await umpkGetRAM()

    setMemory(umpkRam)
  }

  useEffect(() => {
    const int = setInterval(f, 1)

    return () => clearInterval(int)
  }, [])

  const onMemoryChange = async (x: number, i: number) => {
    await umpkWriteToMemory(0x0800 + i, x)

    setMemory(mem => {
      mem[i] = x
      return new Uint8Array(mem)
    })
  }

  const onPaste = async (arr: Uint8Array, fromIndex: number) => {
    await Promise.all(Array.from(arr.entries()).map(([i, x]) => umpkWriteToMemory(0x0800 + fromIndex + i, x)))
  }

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory} onPaste={onPaste} onMemoryChange={onMemoryChange} startLabel={0x0800} />
    </div>
  )
}
