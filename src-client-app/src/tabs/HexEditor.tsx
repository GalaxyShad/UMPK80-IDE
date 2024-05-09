import { cn } from '@/lib/utils.ts'
import React from 'react'

const BYTES_PER_ROW = 16

interface HexEditorCellProps {
  byte: number
  index: number
  onChange?: (value: number) => void
}

function HexEditorCell(props: HexEditorCellProps) {
  let { byte, index, onChange } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleByteChange = (index: number, value: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(value, 16)

    if (!isNaN(num) && num >= 0 && num <= 255) {
      onChange?.(num)
    }

    if (value.length >= 2) {
      const nextInput = e.target.parentElement?.nextElementSibling?.children[0] as HTMLInputElement
      nextInput.focus()
    }
  }

  return (
    <td className={cn(index === 7 && 'pl-2', (byte === 0) && 'text-neutral-700')} key={index}>
      {byte.toHexString()}
      {/*<input*/}
      {/*  className={cn("w-6 bg-transparent", (byte === 0) && 'text-neutral-700')}*/}
      {/*  type="text"*/}
      {/*  value={hex(byte)}*/}
      {/*  onFocus={(e) => e.target.value = ''}*/}
      {/*  onBlur={(e) => e.target.value = hex(byte)}*/}
      {/*  onChange={(e) => handleByteChange(index, e.target.value, e)}*/}
      {/*/>*/}
    </td>
  )
}

interface HexEditorProps {
  memory: Uint8Array,
  onMemoryChange?: (value: number, index: number) => void,
  startLabel?: number
}

export default function HexEditor({ memory, onMemoryChange, startLabel = 0 }: HexEditorProps) {
  const renderRow = (startIndex: number) => {
    const bytes = memory.slice(startIndex, startIndex + BYTES_PER_ROW)
    return (
      <tr key={startIndex}>
        <td className="pr-3"> {(startLabel + startIndex).toHexString(2)}</td>
        {Array.from(bytes).map((byte, index) => (
          <td key={startIndex + 1 + index} className={cn(index === 8 && 'pl-2', (byte === 0) && 'text-neutral-700')}>
            {byte.toHexString()}
          </td>))}
      </tr>
    )
  }

  return (
    <table className="font-mono">
      <thead>
      <tr>
        <th>ADR</th>
        {Array.from(Array(BYTES_PER_ROW).keys()).map((byteIndex) => (
          <th key={byteIndex}>{byteIndex.toHexString()}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {Array.from(Array(Math.ceil(memory.length / BYTES_PER_ROW)).keys()).map((rowIndex) =>
        renderRow(rowIndex * BYTES_PER_ROW),
      )}
      </tbody>
    </table>
  )
}