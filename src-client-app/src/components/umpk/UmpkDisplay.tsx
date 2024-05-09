import { useUMPK80Store } from '@/store/umpkStore.ts'
import SevenSegmentDisplay from '@/components/ui/SevenSegmentDisplay.tsx'
import { cn } from '@/lib/utils.ts'

export default function UmpkDisplay({ className }: { className?: string }) {
  const digit = useUMPK80Store((state => state.display))

  return (
    <div
      className={cn('mx-auto grid grid-cols-[1fr_1fr_1fr_1fr_0.05fr_1fr_1fr] gap-3 w-full max-w-[335px]', className)}>
      <SevenSegmentDisplay className="w-full" value={digit[0]} />
      <SevenSegmentDisplay className="w-full" value={digit[1]} />
      <SevenSegmentDisplay className="w-full" value={digit[2]} />
      <SevenSegmentDisplay className="w-full" value={digit[3]} />

      <SevenSegmentDisplay className="w-full col-start-6" value={digit[4]} />
      <SevenSegmentDisplay className="w-full" value={digit[5]} />
    </div>
  )
}
