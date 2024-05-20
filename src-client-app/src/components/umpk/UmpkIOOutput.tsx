import { bitsToBooleanList, cn } from '@/lib/utils.ts'
import { useUMPK80Store } from '@/store/umpkStore.ts'

function Segment({ value }: { value: boolean }) {
  return (
    <div
      className={cn(
        'w-5 h-9 rounded-sm border',
        value ? 'bg-primary' : 'bg-primary/15',
      )}
    />
  )
}

export default function UmpkIOPortOutput() {
  const output = useUMPK80Store(s => s.io)

  return (
    <div className="flex flex-row gap-1 px-2 border h-full items-center justify-center rounded">
      {bitsToBooleanList(output).map((x, i) => (
        <Segment value={x} key={i} />
      ))}
    </div>
  )
}
