import { KeyboardKey, UmpkKeyboardControl, UmpkKeyboardNumber } from '@/components/umpk/UmpkKeyboard.tsx'
import { Volume2 } from 'lucide-react'
import { UmpkIOPortInput, UmpkIOPortOutput } from '@/components/umpk/UmpkIOOutput.tsx'
import UmpkRegistersControl from '@/components/umpk/UmpkRegistersControl.tsx'
import { Slider } from '@/components/ui/Slider.tsx'
import { invoke } from '@tauri-apps/api/tauri'
import UmpkDisplay from '@/components/umpk/UmpkDisplay.tsx'
import { useUMPK80Store } from '@/store/umpk.ts'
import { useRef, useState } from 'react'
import { UmpkFlags } from '@/components/umpk/UmpkFlags.tsx'

function useUmpkRealKeyboardBindings(): [
  React.RefObject<HTMLDivElement>,
  (e: React.KeyboardEvent<HTMLDivElement>) => void,
  (e: React.KeyboardEvent<HTMLDivElement>) => void,
  KeyboardKey[],
] {
  const refUmpk = useRef<HTMLDivElement>(null)

  const [pressedKeys, setPressedKeys] = useState<KeyboardKey[]>([])

  const keyMap = {
    Digit0: KeyboardKey._0,
    Digit1: KeyboardKey._1,
    Digit2: KeyboardKey._2,
    Digit3: KeyboardKey._3,
    Digit4: KeyboardKey._4,
    Digit5: KeyboardKey._5,
    Digit6: KeyboardKey._6,
    Digit7: KeyboardKey._7,
    Digit8: KeyboardKey._8,
    Digit9: KeyboardKey._9,
    KeyA: KeyboardKey._A,
    KeyB: KeyboardKey._B,
    KeyC: KeyboardKey._C,
    KeyD: KeyboardKey._D,
    KeyE: KeyboardKey._E,
    KeyF: KeyboardKey._F,
    Space: KeyboardKey.OT_A,
    ArrowRight: KeyboardKey.ZP_UV,
    ArrowLeft: KeyboardKey.UM,
    ShiftLeft: KeyboardKey.OT_RG,
    ShiftRight: KeyboardKey.OT_RG,
  } as Record<string, KeyboardKey>

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== refUmpk.current) return

    console.log(e.code)

    const key = keyMap[e.code]

    if (key !== undefined) {
      setPressedKeys((x) => [...x, key])
      invoke('umpk_press_key', { key })
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== refUmpk.current) return

    const key = keyMap[e.code]

    if (key !== undefined) {
      setPressedKeys((prevPressedKeys) => prevPressedKeys.filter((pk) => pk !== key))
      invoke('umpk_release_key', { key })
    }
  }

  return [refUmpk, handleKeyDown, handleKeyUp, pressedKeys]
}

export default function UmpkTab() {
  const [refUmpk, handleKeyDown, handleKeyUp, pressedKeys] = useUmpkRealKeyboardBindings()

  async function setIOInput(hex: number) {
    console.log({ hex })
    await invoke('umpk_set_io_input', { io: hex })
  }

  const io = useUMPK80Store((state) => state.io)
  const registers = useUMPK80Store((state) => state.registers)
  const digit = useUMPK80Store((state) => state.digit)
  const pg = useUMPK80Store((state) => state.pg)

  return (
    <div
      className="flex flex-col py-4 px-4 h-full w-full outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={refUmpk}
    >
      <UmpkDisplay digit={digit} pg={pg} />

      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <UmpkFlags
          psw={registers.psw}
          onPswChange={(data) => invoke('umpk_set_register', { registerName: 'psw', data })}
        />

        <div className="bg-card flex flex-row gap-2 font-semibold rounded px-2 py-1 items-center">
          <Volume2 className="text-neutral-700" size={24} />
          <Slider />
        </div>

        <UmpkRegistersControl registers={registers} />

        <div className="flex flex-col justify-between gap-2">
          <UmpkIOPortOutput value={io} />
          <UmpkIOPortInput onChange={setIOInput} />
        </div>

        <UmpkKeyboardControl pressedKeys={pressedKeys} />
        <UmpkKeyboardNumber pressedKeys={pressedKeys} />
      </div>
    </div>
  )
}



