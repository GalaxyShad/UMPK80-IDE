import { forwardRef } from 'react'
import { Button, ButtonProps } from '../ui/Button.jsx'

import { cn } from '@/lib/utils.ts'
import { KeyboardKey } from '@/services/umpkService.ts'
import { useUMPK80Store } from '@/store/umpkStore.ts'

interface Button {
  binary: KeyboardKey;
  name: string;
  startWithNextCol?: boolean;
  disabled?: boolean;
}

// prettier-ignore
const buttonsControlMap = [
  { name: 'R', binary: KeyboardKey.R, startWithNextCol: true },
  { name: 'ШЦ', binary: KeyboardKey.SHC, disabled: true },
  { name: 'ШК', binary: KeyboardKey.SHK, startWithNextCol: true },
  { name: 'Пр Сч', binary: KeyboardKey.PR_SCH },

  { name: 'Ст', binary: KeyboardKey.ST },
  { name: 'От Рг', binary: KeyboardKey.OT_RG },
  { name: 'От А', binary: KeyboardKey.OT_A },

  { name: 'П', binary: KeyboardKey.P },
  { name: 'Ум', binary: KeyboardKey.UM },
  { name: 'Зп Ув', binary: KeyboardKey.ZP_UV },
]

// prettier-ignore
const buttonsNumberMap = [
  { name: 'C', binary: KeyboardKey._C },
  { name: 'D', binary: KeyboardKey._D },
  { name: 'E', binary: KeyboardKey._E },
  { name: 'F', binary: KeyboardKey._F },

  { name: '8', binary: KeyboardKey._8 },
  { name: '9', binary: KeyboardKey._9 },
  { name: 'A', binary: KeyboardKey._A },
  { name: 'B', binary: KeyboardKey._B },

  { name: '4', binary: KeyboardKey._4 },
  { name: '5', binary: KeyboardKey._5 },
  { name: '6', binary: KeyboardKey._6 },
  { name: '7', binary: KeyboardKey._7 },

  { name: '0', binary: KeyboardKey._0 },
  { name: '1', binary: KeyboardKey._1 },
  { name: '2', binary: KeyboardKey._2 },
  { name: '3', binary: KeyboardKey._3 },
] as Button[]

interface KeyboardButtonProps {
  value: KeyboardKey,
}

const KeyboardButton = forwardRef<HTMLButtonElement, KeyboardButtonProps & ButtonProps>(
  ({ value, children, className, disabled }, ref) => {
    const pressKey = useUMPK80Store(s => s.pressKey)
    const releaseKey = useUMPK80Store(s => s.releaseKey)

    return (
      <Button
        ref={ref}
        variant="secondary"
        disabled={disabled}
        className={cn(className)}
        tabIndex={-1}
        onMouseDown={async () => await pressKey(value)}
        onMouseUp={async () => await releaseKey(value)}
        onMouseLeave={async () => await releaseKey(value)}
      >
        {children}
      </Button>
    )
  })

interface UmpkKeyboardProps {
  pressedKeys?: KeyboardKey[]
}

export default function UmpkKeyboard({ pressedKeys }: UmpkKeyboardProps) {
  const renderButton = (btn: Button) => (
    <KeyboardButton
      className={cn(
        pressedKeys?.includes(btn.binary) && 'bg-primary',
        btn.startWithNextCol && 'col-start-2',
      )}
      key={btn.binary}
      value={btn.binary}
      disabled={btn.disabled}
    >
      {btn.name}
    </KeyboardButton>
  )

  return (
    <>
      <div className="grid grid-cols-3 gap-2 w-fit ml-auto">
        {buttonsControlMap.map(renderButton)}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttonsNumberMap.map(renderButton)}
      </div>
    </>
  )
}
