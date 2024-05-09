import { useState } from 'react'
import HexEditor from '@/tabs/HexEditor.tsx'


export default function UmpkRamTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array(2048))

  // const f = async () => {
  //   const umpkRam = await invoke<Uint8Array>('umpk_get_ram')
  //
  //   setMemory(umpkRam)
  // }

  // useEffect(() => {
  //   const int = setInterval(f, 60)
  //
  //   return () => clearInterval(int)
  // }, [])

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory} onMemoryChange={(x, i) => setMemory(mem => {
        mem[i] = x
        return new Uint8Array(mem)
      })} startLabel={0x0800} />
    </div>
  )
}
