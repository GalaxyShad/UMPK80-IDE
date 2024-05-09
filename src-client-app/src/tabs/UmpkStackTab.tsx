import { useUMPK80Store } from '@/store/umpkStore.ts'
import { AutoSizer, Column, Table } from 'react-virtualized'

export default function UmpkStackTab() {
  //TODO
  const stack = [] as number[]//useUMPK80Store((state) => state.stack)
  const stackStart = 0//useUMPK80Store((state) => state.stackStart)
  const stackPointer = useUMPK80Store((state) => state.registers.sp)

  const hexToString = (x: number, pad = 2) => x.toString(16).padStart(pad, '0').toUpperCase()

  return (
    <div className="h-full w-full overflow-auto mx-2 font-mono">
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={stack.length}
            rowClassName={({ index }) =>
              stackStart - index === stackPointer ? 'text-primary' : 'text-neutral-600'
            }
            rowGetter={({ index }) => ({
              adr: hexToString(stackStart - index, 4) + ':',
              data: hexToString(stack[index]),
            })}
          >
            <Column label="ADR" dataKey="adr" width={50} />
            <Column width={50} label="DATA" dataKey="data" />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}
