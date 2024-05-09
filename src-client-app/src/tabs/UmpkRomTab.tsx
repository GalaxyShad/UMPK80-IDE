import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import HexEditor from '@/tabs/HexEditor.tsx'

export default function UmpkRomTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array())

  useEffect(() => {
    const f = async () => {
      const rom = await invoke<Uint8Array>('umpk_get_rom')

      setMemory(rom)
    }

    f()
  }, [])

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory} />
    </div>
  )
}