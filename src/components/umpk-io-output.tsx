import React, { useState } from "react";
import { SwitchVertical } from "./ui/switch-vertical";
import { cn } from "@/lib/utils";

type Props = {};

function Segment({ value }: { value: boolean }) {
  return (
    <div className={cn("w-5 h-9 rounded-sm border", (value) ? "bg-primary" : "bg-primary-foreground")} />
  );
}

export default function UmpkIoOutput({}: Props) {
  const [value, setValue] = useState<boolean[]>(new Array(8).fill(false));

  const [input, setInput] = useState<boolean[]>(new Array(8).fill(false));

  return (
    <div className="flex flex-col gap-2 w-60">
      <div className="flex flex-row gap-1 px-2 py-2 border justify-center rounded">
        {value?.map((x, i) => (
          <Segment value={x} key={i} />
        ))}
      </div>
      <div className="flex flex-row gap-1 px-2 py-2 border justify-center rounded">
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
    </div>
  );
}
