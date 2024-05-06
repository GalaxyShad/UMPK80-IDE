import { useEffect, useState } from 'react'
import { AutoSizer, Column, Index, Table } from 'react-virtualized'
import { invoke } from '@tauri-apps/api/tauri'
import { cn } from '@/lib/utils.ts'

interface DisassembledLinePayload {
  address: number
  mnemonic: string
  arguments: number[]
  bytes: number[]
}

function UmpkProgramView() {
  const [rom, setRom] = useState<DisassembledLinePayload[]>([])

  useEffect(() => {
    (async () => {
      const res = await invoke<DisassembledLinePayload[]>('umpk_get_disassembled_rom')

      console.log({ res })

      setRom(res)
    })()
  }, [])

  const rowGetter = ({ index }: Index) => ({
    address: rom[index].address.toHexString(),
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
    <div className="flex w-full h-full font-mono text-sm">
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={rom.length}
            // rowClassName={({index}) => ((stackStart - index) === stackPointer) ? "text-primary" : "text-neutral-600"}
            rowGetter={rowGetter}
          >
            <Column label="ADR" dataKey="address" width={50} />
            <Column label="MC" dataKey="bytes" width={75} />
            <Column
              label="ASM"
              dataKey="instruction"
              width={100}
              className={cn('text-neutral-700')}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}

export default UmpkProgramView
