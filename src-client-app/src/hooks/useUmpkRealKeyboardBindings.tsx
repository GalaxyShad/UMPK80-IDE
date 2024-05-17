import { KeyboardEvent, RefObject, useRef, useState } from 'react'
import { KeyboardKey } from '@/services/umpkService.ts'
import { useUMPK80Store } from '@/store/umpkStore.ts'

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

export function useUmpkRealKeyboardBindings(): [
  RefObject<HTMLDivElement>,
  (e: KeyboardEvent<HTMLDivElement>) => void,
  (e: KeyboardEvent<HTMLDivElement>) => void,
  KeyboardKey[],
] {
  const refUmpk = useRef<HTMLDivElement>(null)

  const [pressedKeys, setPressedKeys] = useState<KeyboardKey[]>([])

  const pressKey = useUMPK80Store(s => s.pressKey)
  const releaseKey = useUMPK80Store(s => s.releaseKey)

  const handleKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== refUmpk.current) return

    const key = keyMap[e.code]

    e.preventDefault()

    if (key !== undefined) {
      setPressedKeys((x) => [...x, key])

      await pressKey(key)
    }
  }

  const handleKeyUp = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== refUmpk.current) return

    const key = keyMap[e.code]
    
    e.preventDefault()

    if (key !== undefined) {
      setPressedKeys((prevPressedKeys) => prevPressedKeys.filter((pk) => pk !== key))

      await releaseKey(key)
    }
  }

  return [refUmpk, handleKeyDown, handleKeyUp, pressedKeys]
}