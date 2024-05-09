import { useEffect, useState } from 'react'
import { AutoSizer, Column, Index, Table } from 'react-virtualized'
import { cn } from '@/lib/utils.ts'
import { useUMPK80Store } from '@/store/umpkStore.ts'
import { UMPK80DisassembledLine, umpkGetDisassembledROM } from '@/services/umpkService.ts'

function UmpkProgramTab() {
  const [rom, setRom] = useState<UMPK80DisassembledLine[]>([])

  const pc = useUMPK80Store(s => s.display_address)

  const romFlattenMap = rom.flatMap(x => x.bytes.map(() => x))

  useEffect(() => {
    (async () => {
      const res = await umpkGetDisassembledROM()
      setRom(res)
    })()
  }, [])

  const rowGetter = ({ index }: Index) => ({
    address: rom[index].address.toHexString(2) + ':',
    instruction:
      rom[index].mnemonic +
      ' ' +
      rom[index].arguments.map((x) => x.toHexString()).join('') +
      (rom[index].arguments.length !== 0 ? 'h' : ''),
    bytes: `${rom[index].bytes[0].toHexString()} ${rom[index].bytes
      .slice(1, 3)
      .map((x) => x.toHexString())
      .join('')}`,
    isNop: rom[index].mnemonic === 'NOP',
  })

  return (
    <div className="flex w-full h-full font-mono text-sm text-foreground/90">
      <AutoSizer>
        {({ height, width }) => (
          <Table
            scrollToIndex={rom.indexOf(romFlattenMap[pc])}
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={rom.length}
            rowClassName={({ index }) => cn(
              'hover:bg-primary/20',
              rom[index]?.bytes[0] === 0 && 'text-foreground/30',
              (rom[index] == romFlattenMap[pc]) && 'text-primary',
            )}
            rowGetter={rowGetter}
          >
            <Column label="ADR" dataKey="address" width={50} />
            <Column label="MC" dataKey="bytes" width={75} />
            <Column
              label="ASM"
              dataKey="instruction"
              width={100}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}

export default UmpkProgramTab
