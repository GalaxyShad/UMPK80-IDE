import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import HexEditor from '@/tabs/HexEditor.tsx'


export default function UmpkRamTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array())

  const f = async () => {
    const umpkRam = await invoke<Uint8Array>('umpk_get_ram')

    setMemory(umpkRam)
  }

  useEffect(() => {
    const int = setInterval(f, 60)

    return () => clearInterval(int)
  }, [])

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory} startLabel={0x0800} />
    </div>
  )
}
