import { useUMPK80Store } from '@/store/umpkStore.ts'
import { bitsToBooleanList } from '@/lib/utils.ts'
import { SwitchVertical } from '@/components/ui/SwitchVertical.tsx'

export default function UmpkIOPortInput() {
  const input = useUMPK80Store(s => s.ioInput)
  const setInput = useUMPK80Store(s => s.setIOInput)

  return (
    <div className="min-w-[200px] flex flex-row gap-1 px-2 h-full border items-center justify-center rounded">
      {bitsToBooleanList(input).map((x, i) => (
        <SwitchVertical
          key={i}
          checked={x}
          onCheckedChange={async (checked) => {
            const ri = 7 - i

            await setInput(checked
              ? (input | (1 << ri))
              : (input & ~(1 << ri)),
            )
          }}
        />
      ))}
    </div>
  )
}