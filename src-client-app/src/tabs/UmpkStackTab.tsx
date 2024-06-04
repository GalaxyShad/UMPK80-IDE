import { useUMPK80Store } from '@/store/umpkStore.ts'
import { AutoSizer, Column, Table } from 'react-virtualized'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils.ts'

export default function UmpkStackTab() {
  const [stack, setStack] = useState<Uint8Array>(new Uint8Array())

  const stackStart = 0x0BB0
  const getStack = useUMPK80Store(s => s.getStack)
  const stackPointer = useUMPK80Store(s => s.registers.sp)

  useEffect(() => {
    const int = setInterval(async () => {
      const stack = await getStack()
      setStack(stack)
    }, 50)

    return () => clearInterval(int)
  }, [getStack])

  return (
    <div className="h-full w-full overflow-hidden font-mono text-sm">
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={stack.length / 2}
            rowGetter={({ index }) => ({
              adr: (stackStart - index * 2).toHexString(2) + ':',
              low: stack[index * 2],
              high: stack[index * 2 + 1],
              isCurrentSp: (index === Math.floor((stackStart - stackPointer) / 2)),
            })}
          >
            <Column width={45} label="ADR" dataKey="adr" />
            <Column width={18} label="L" dataKey="low" cellRenderer={x => <p
              className={cn(
                (x.cellData === 0) && 'text-foreground/20',
                x.rowData.isCurrentSp && 'text-primary/65',
                x.rowData.isCurrentSp && ((stackPointer % 2) === 0) && 'text-primary',
              )}>{x.cellData.toHexString()}</p>} />
            <Column width={18} label="H" dataKey="high" cellRenderer={x => <p
              className={cn(
                (x.cellData === 0) && 'text-foreground/20',
                x.rowData.isCurrentSp && 'text-primary/65',
                x.rowData.isCurrentSp && ((stackPointer % 2) === 1) && 'text-primary',
              )}>{x.cellData.toHexString()}</p>} />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}
