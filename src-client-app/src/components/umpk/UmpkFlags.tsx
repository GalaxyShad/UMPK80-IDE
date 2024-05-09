import { FlagIcon } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle.tsx'
import { useUMPK80Store } from '@/store/umpkStore.ts'
import UmpkIconPanel from '@/components/umpk/UmpkIconPanel.tsx'

interface Flag {
  name: string
  mask: number
}

const flags = [
  { name: 'S', mask: 0b10000000 },
  { name: 'Z', mask: 0b01000000 },
  { name: 'AC', mask: 0b00010000 },
  { name: 'P', mask: 0b00000100 },
  { name: 'C', mask: 0b00000001 },
] as Flag[]

export default function UmpkFlags() {
  const psw = useUMPK80Store(s => s.registers.psw)
  const setPsw = useUMPK80Store(s => s.setRegister)

  const handleChange = (mask: number, pressed: boolean) =>
    setPsw('psw', pressed ? psw | mask : psw & ~mask)

  return (
    <UmpkIconPanel icon={<FlagIcon size={20} />}>
      {flags.map((flag, i) => (
        <Toggle
          size="sm"
          key={i}
          pressed={(psw & flag.mask) !== 0}
          onPressedChange={(pressed) => handleChange(flag.mask, pressed)}
        >
          {flag.name}
        </Toggle>
      ))}
    </UmpkIconPanel>
  )
}