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

export function UmpkIOPortInput() {
  const [input, setInput] = useState<boolean[]>(new Array(8).fill(false));

  return (
    <div className="min-w-[200px] flex flex-row gap-1 px-2 py-4 border justify-center rounded">
      {input.map((x, i) => (
        <SwitchVertical
          key={i}
          checked={x}
          onCheckedChange={(checked) =>
            setInput(input.map((y, yi) => (yi == i ? checked : y)))
          }
        />
      ))}
    </div>
  );
}

export function UmpkIOPortOutput() {
  const [value, setValue] = useState<boolean[]>(new Array(8).fill(false));

  return (
    <div className="flex flex-row gap-1 px-2 py-4 border justify-center rounded">
      {value?.map((x, i) => (
        <Segment value={x} key={i} />
      ))}
    </div>
  );
}
