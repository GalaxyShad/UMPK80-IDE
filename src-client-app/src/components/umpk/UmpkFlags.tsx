import { FlagIcon } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle.tsx'

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

interface UmpkFlagsProps {
  psw: number
  onPswChange: (psw: number) => void
}

export function UmpkFlags({ psw, onPswChange }: UmpkFlagsProps) {
  const handleChange = (mask: number, pressed: boolean) => onPswChange(pressed ? psw | mask : psw & ~mask)

  return (
    <div className="bg-card flex flex-row font-semibold justify-between rounded  items-center">
      <div className="text-neutral-700 h-full aspect-square flex items-center justify-center bg-accent/50 rounded">
        <FlagIcon size={24} />
      </div>
      <div className="flex flex-row gap-1 px-2 py-1">
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
      </div>
    </div>
  )
}