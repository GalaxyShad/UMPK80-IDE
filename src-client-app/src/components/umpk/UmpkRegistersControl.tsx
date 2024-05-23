import { Label } from '@/components/ui/Label.tsx'
import { HexInput } from '@/components/ui/HexInput'

import { useUMPK80Store } from '@/store/umpkStore.ts'
import { RegisterName } from '@/services/umpkService.ts'
import { cn } from '@/lib/utils.ts'
import React from 'react'


export default function UmpkRegistersControl() {
  const registers = useUMPK80Store(s => s.registers)
  const setRegister = useUMPK80Store(s => s.setRegister)

  const registerOrder = [
    'a', 'm',
    'b', 'c',
    'd', 'e',
    'h', 'l',
    'pc',
    'sp',
  ] as RegisterName[]

  const isTwoByte = (reg: RegisterName): boolean => (reg === 'pc' || reg === 'sp')

  return (
    <div className="grid grid-cols-[0fr_1fr_0fr_1fr] gap-x-2 gap-y-2 font-mono items-center h-full">
      {registerOrder.map((registerName) => (
        <React.Fragment key={registerName}>
          <Label
            htmlFor={registerName}
            className="text-foreground/40"
          >
            {registerName.toUpperCase()}
          </Label>
          <HexInput
            id={registerName}
            value={registers[registerName]}
            onBlur={data => registerName !== 'm' && setRegister(registerName, data)}
            readOnly={registerName === 'm'}
            bytesLen={1 + +isTwoByte(registerName)}
            className={cn(
              'w-full h-full',
              isTwoByte(registerName) && 'col-span-3',
              registers[registerName] === 0 && 'text-foreground/20',
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
