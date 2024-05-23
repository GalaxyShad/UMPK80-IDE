import { useEffect, useState } from 'react'
import { AutoSizer, Column, Index, Table } from 'react-virtualized'
import { cn } from '@/lib/utils.ts'
import { useUMPK80Store } from '@/store/umpkStore.ts'
import { AssemblyListingLine, translatorGetMonitorSystem } from '@/services/translatorService.ts'

function UmpkProgramTab() {
  const [romListing, setRomListing] = useState<AssemblyListingLine[]>([])
  const ramListing = useUMPK80Store(s => s.ramListing)

  const pc = useUMPK80Store(s => s.display_address)

  const completeListing = [...romListing, ...ramListing]

  const fetchRomListing = async () => {
    const res = await translatorGetMonitorSystem()

    if (!res.isSuccess) return

    setRomListing([
      ...res.value,
      ...(new Array(30)).fill({}).map((_, i) => ({
        address: 0x07E2 + i,
        bytes: [0x00],
        label: '',
        assemblyCode: 'NOP',
        comment: '',
      } as AssemblyListingLine)),
    ])
  }

  useEffect(() => {
    fetchRomListing().then()
  }, [])

  const rowGetter = ({ index }: Index) => {
    const line = completeListing[index]

    if (line === undefined)
      return {
        address: null,
        bytes: [0],
        assemblyCode: 'NOP',
        comment: '',
        label: '',
        isNop: true,
      } as AssemblyListingLine

    const address = (line.address !== null)
      ? line.address.toHexString(2) + ':'
      : ''

    const bytes = line.bytes.length !== 0
      ? Array.from(line.bytes).map((x, i) => (i === 1 ? ' ' : '') + x.toHexString()).join('')
      : ''

    const label = line.label
    const instruction = line.assemblyCode
    const comment = '; ' + line.comment

    return {
      address, bytes, label, instruction, comment,
      isNop: bytes === '00',
    }
  }

  return (
    <div className="flex w-full h-full font-mono text-sm text-foreground/90">
      <AutoSizer>
        {({ height, width }) => (
          <Table
            scrollToIndex={completeListing.findIndex(x => x.address !== null && x.address === pc)}
            scrollToAlignment="center"
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={completeListing.length}
            rowClassName={({ index }) => cn(
              'hover:bg-primary/20',
              completeListing[index]?.bytes[0] === 0 && 'text-foreground/30',
              completeListing?.[index] && completeListing[index].address !== null && completeListing[index].address === pc && 'text-primary',
            )}
            rowGetter={rowGetter}
          >
            <Column label="ADR" dataKey="address" width={80} minWidth={50} />
            <Column label="MC" dataKey="bytes" width={150} minWidth={70} />
            <Column
              label="LABEL"
              dataKey="label"
              width={100}
              minWidth={50}
            />
            <Column
              label="ASM"
              dataKey="instruction"
              width={200}
              minWidth={120}
            />
            <Column
              label="ASM"
              dataKey="comment"
              width={500}
              className="text-green-500/40"
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}

export default UmpkProgramTab
