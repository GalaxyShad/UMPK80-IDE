import { useUMPK80Store } from '@/store/umpk'
import SevenSegmentDisplay from '@/components/ui/SevenSegmentDisplay.tsx'

export default function UmpkDisplay() {
  const digit = useUMPK80Store((state => state.digit))

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-row">
        <SevenSegmentDisplay value={digit[0]} />
        <SevenSegmentDisplay value={digit[1]} />
        <SevenSegmentDisplay value={digit[2]} />
        <SevenSegmentDisplay value={digit[3]} />
      </div>
      <div className="flex flex-row">
        <SevenSegmentDisplay value={digit[4]} />
        <SevenSegmentDisplay value={digit[5]} />
      </div>
    </div>
  )
}
