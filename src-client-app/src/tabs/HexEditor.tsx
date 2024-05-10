import { AutoSizer, Grid, GridCellRenderer } from 'react-virtualized'
import { cn } from '@/lib/utils.ts'
import { ChangeEventHandler, useState } from 'react'

const BYTES_PER_ROW = 16

interface HexEditorCellProps {
  value: number,
  onChange?: (value: number) => void,
  readonly?: boolean,
  onPaste?: (values: Uint8Array) => void,
}

function HexEditorCell({ value, onChange, onPaste, readonly = false }: HexEditorCellProps) {
  const [isChanging, setIsChanging] = useState(false)

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '')
      return

    if (e.target.value.length > 2) {
      getSiblingDiv(e.target.parentElement, 1, 1)?.focus()
    }

    const num = parseInt(e.target.value, 16)

    if (!isNaN(num) && num >= 0 && num <= 255) {
      e.target.value = num.toHexString()
      onChange?.(num)
    } else {
      e.target.value = ''
    }
  }

  const getSiblingDiv = (parentElement: Element | null | undefined, direction: number, steps: number): HTMLDivElement | undefined => {
    let sibling = parentElement

    for (let i = 0; i < steps; i++) {
      while ((sibling = sibling?.[direction === 1 ? 'nextElementSibling' : 'previousElementSibling'])?.children?.[0].tagName === 'P') { /* empty */
      }
    }

    return sibling?.children?.[0] as HTMLDivElement | undefined
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'ArrowLeft') {
      const prevDiv = getSiblingDiv(e.currentTarget.parentElement, -1, 1)
      prevDiv?.focus()
    } else if (e.key === 'ArrowRight') {
      const nextDiv = getSiblingDiv(e.currentTarget.parentElement, 1, 1)
      nextDiv?.focus()
    } else if (e.key === 'ArrowUp') {
      const upDiv = getSiblingDiv(e.currentTarget.parentElement, -1, 16)
      upDiv?.focus()
    } else if (e.key === 'ArrowDown') {
      const downDiv = getSiblingDiv(e.currentTarget.parentElement, 1, 16)
      downDiv?.focus()
    } else if (e.key === 'Backspace') {
      if ((e.currentTarget.value === '') || (e.currentTarget.value === '00')) {
        getSiblingDiv(e.currentTarget.parentElement, -1, 1)?.focus()
        e.currentTarget.value = '00'
        onChange?.(0)
      }
    }
  }

  const onPasteHandle: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const data = e.clipboardData.getData('text/plain')

    if (data === '')
      return

    const arr = data.split('\n').map(x => Number.parseInt(x, 16))

    e.preventDefault()

    onPaste?.(new Uint8Array(arr))
  }

  const isShouldInputRender = isChanging && !readonly

  return (
    <>
      {!isShouldInputRender && (
        <div tabIndex={0} onFocus={() => setIsChanging(true)}
             className={cn((value === 0x00) && 'text-secondary', 'm-auto w-full h-full')}>
          {value.toHexString()}
        </div>
      )}
      {isShouldInputRender && (
        <input
          autoFocus
          placeholder={value.toHexString()}
          onPaste={onPasteHandle}
          className="text-center font-mono w-full h-full bg-transparent border-b border-b-primary outline-none"
          onBlur={() => setIsChanging(false)}
          onKeyDown={onKeyDown}
          onChange={onInputChange}
        />
      )}
    </>
  )
}

interface HexEditorProps {
  memory: Uint8Array,
  onMemoryChange?: (value: number, index: number) => void,
  startLabel?: number,
  readonly?: boolean,
  onPaste?: (clipboard: Uint8Array, fromIndex: number) => void,
}

export default function HexEditor({ memory, onMemoryChange, startLabel, onPaste, readonly = false }: HexEditorProps) {
  const colNum = BYTES_PER_ROW + 1
  const linesCount = Math.ceil(memory.length / BYTES_PER_ROW)

  const cellRenderer: GridCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const index = rowIndex * BYTES_PER_ROW + columnIndex

    return (
      <div className={cn('font-mono text-center', columnIndex === 8 && 'pl-1')} key={key} style={style}>
        {columnIndex !== 0 &&
          <HexEditorCell readonly={readonly} value={memory[index - 1]}
                         onChange={x => onMemoryChange?.(x, index - 1)}
                         onPaste={arr => onPaste?.(arr, index - 1)}
          />}
        {columnIndex === 0 && <p data-type="label">{((startLabel ?? 0) + rowIndex * BYTES_PER_ROW).toHexString(2)}</p>}
      </div>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          className="font-mono"
          height={height}
          width={width}
          rowCount={linesCount}
          columnCount={colNum}
          rowHeight={22}
          columnWidth={({ index }) => (index === 8) ? 30 : ((index === 0) ? 64 : 24)}
          cellRenderer={cellRenderer}
        />
      )}
    </AutoSizer>
  )

}