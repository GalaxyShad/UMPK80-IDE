import React, { useState } from "react";
import { SwitchVertical } from "./ui/switch-vertical";
import { cn } from "@/lib/utils";

function Segment({ value }: { value: boolean }) {
  return (
    <div
      className={cn(
        "w-5 h-9 rounded-sm border",
        value ? "bg-primary" : "bg-primary-foreground"
      )}
    />
  );
}

const boolArrayToByte = (boolArray: boolean[]): number =>
  boolArray.reduce(
    (byte: number, current: boolean, index: number) =>
      byte | (current ? 1 << (7 - index) : 0),
    0
  );

export function UmpkIOPortInput({
  onChange,
}: {
  onChange: (hex: number) => void;
}) {
  const [input, setInput] = useState<boolean[]>(new Array(8).fill(true));

  return (
    <div className="min-w-[200px] flex flex-row gap-1 px-2 py-4 border justify-center rounded">
      {input.map((x, i) => (
        <SwitchVertical
          key={i}
          checked={x}
          onCheckedChange={(checked) => {
            const newValue = input.map((y, yi) => (yi == i ? checked : y));

            setInput(newValue);
            onChange(boolArrayToByte(newValue));
          }}
        />
      ))}
    </div>
  );
}

const bitsToBooleanList = (value: number, bitsCount = 8): boolean[] =>
  [...Array<boolean>(bitsCount)]
    .map((_, i) => ((value >> i) & 1) != 0)
    .reverse();

export function UmpkIOPortOutput({ value }: { value: number }) {
  return (
    <div className="flex flex-row gap-1 px-2 py-4 border justify-center rounded">
      {bitsToBooleanList(value).map((x, i) => (
        <Segment value={x} key={i} />
      ))}
    </div>
  );
}
