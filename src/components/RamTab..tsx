import React, {memo, useEffect, useMemo, useState} from 'react';
import {AutoSizer, Column, Grid, Table} from "react-virtualized";
import {GridCellProps} from "react-virtualized/dist/es/Grid";
import {HexInput} from "@/components/ui/hex-input";

import {cn} from "@/lib/utils";
import {invoke} from "@tauri-apps/api/tauri";
import {listen} from "@tauri-apps/api/event";
import {useUMPK80Store} from "@/store/umpk";


const BYTES_COUNT = 2048;
const BYTES_PER_ROW = 16;

interface HexEditorProps {
  memory: Uint8Array,
  onMemoryChange?: (value: number, index: number) => void,
  startLabel?: number
}

const hex = (x: number, pad: number = 2) => x.toString(16).padStart(pad, '0').toUpperCase();

interface HexEditorCellProps {
  byte: number
  index: number
  onChange?: (value: number) => void
}

const HexEditorCell = ({byte, index, onChange}: HexEditorCellProps) => {

  const handleByteChange = (index: number, value: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(value, 16);

    if (!isNaN(num) && num >= 0 && num <= 255) {
      onChange?.(num);
    }

    if (value.length >= 2) {
      const nextInput = e.target.parentElement?.nextElementSibling?.children[0] as HTMLInputElement;
      nextInput.focus();
    }
  };

  return (
    <td className={cn(index === 7 && 'pl-2', (byte === 0) && 'text-neutral-700')} key={index}>
      {hex(byte)}
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

const MemoizedHexEditorCell = memo(HexEditorCell);

const HexEditor = ({memory, onMemoryChange, startLabel = 0}: HexEditorProps) => {
  // const [memory, setMemory] = useState(new Uint8Array(BYTES_COUNT));

  const renderRow = (startIndex: number) => {
    const bytes = memory.slice(startIndex, startIndex + BYTES_PER_ROW);
    return (
      <tr key={startIndex}>
        <td className="pr-3"> {hex(startLabel + startIndex, 4)}</td>
        {Array.from(bytes).map((byte, index) => (
          <td key={startIndex + 1 + index} className={cn(index === 8 && 'pl-2', (byte === 0) && 'text-neutral-700')}>
            {hex(byte)}
          </td>))}
        {/*<MemoizedHexEditorCell key={startIndex + index} byte={byte} index={startIndex + index}/>))}*/}
      </tr>
    );
  };

  return (
    <table className="font-mono">
      <thead>
      <tr>
        <th>ADR</th>
        {Array.from(Array(BYTES_PER_ROW).keys()).map((byteIndex) => (
          <th key={byteIndex}>{hex(byteIndex)}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {Array.from(Array(Math.ceil(memory.length / BYTES_PER_ROW)).keys()).map((rowIndex) =>
        renderRow(rowIndex * BYTES_PER_ROW)
      )}
      </tbody>
    </table>
  );
};

export function RomTab() {
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array());

  useEffect(() => {
    const f = async () => {
      const rom = await invoke<Uint8Array>('umpk_get_rom');

      setMemory(rom);
    }

    f();
  }, []);

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory}/>
    </div>
  );
}

function RamTab() {
  // const ram = useUMPK80Store(state => state.ram);
  const [memory, setMemory] = useState<Uint8Array>(new Uint8Array());

  const f = async () => {
    const umpkRam = await invoke<Uint8Array>('umpk_get_ram');

    setMemory(umpkRam);
  }

  useEffect(() => {
    const int = setInterval(f, 60);

    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex h-full w-full">
      <HexEditor memory={memory} startLabel={0x0800}/>
    </div>
  );
}

export default RamTab;