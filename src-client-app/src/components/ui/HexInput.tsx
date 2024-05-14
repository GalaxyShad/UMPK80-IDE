import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Input } from './Input.jsx'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  value?: number;
  minValue?: number;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  bytesLen?: number;
}

// works, but FIXME pls
const HexInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, bytesLen, minValue = 0, ...props }) => {
    const hexPad = (bytesLen ?? 1) * 2

    const refInput = useRef<HTMLInputElement | null>(null)
    const [strValue, setStrValue] = useState<string>((props.value ?? minValue).toHexString(bytesLen))

    useEffect(() => {
      setStrValue((props.value ?? minValue).toHexString(bytesLen))

      refInput.current?.classList.add('border-primary/75')

      const id = setTimeout(() => refInput.current?.classList.remove('border-primary/75'), 100)

      return () => clearTimeout(id)
    }, [props.value, hexPad, bytesLen, minValue])

    function change(e: React.ChangeEvent<HTMLInputElement>) {
      const input = e.currentTarget.value.toUpperCase()

      const regHex = new RegExp(`^[0-9A-F]{1,${hexPad}}$`)

      if (regHex.test(input) || input === '') {
        console.log({input})

        const hex = Number.parseInt(input, 16)

        setStrValue(input)

        props.onChange?.(Number.isNaN(hex) ? 0 : (hex < minValue ? minValue : hex))
      }

    }

    function blur(e: React.FocusEvent<HTMLInputElement>) {
      if (e.currentTarget.value === '') {
        setStrValue((minValue).toHexString(bytesLen))

        props.onChange?.(minValue)
        props.onBlur?.(minValue)

        return
      }

      const hex = Number.parseInt(e.currentTarget.value, 16)
      setStrValue(hex < minValue ? minValue.toHexString(bytesLen) : e.currentTarget.value)
      props.onBlur?.(hex < minValue ? minValue : hex)
    }

    return (
      <Input
        {...props}
        className={cn(className, 'transition-colors')}
        ref={refInput}
        onChange={change}
        onBlur={blur}
        value={strValue}
        autoComplete="off"
      />
    )
  },
)
HexInput.displayName = 'Input'

export { HexInput }
