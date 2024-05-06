"use client";
import { Label } from "@/components/ui/label";
import { HexInput } from "@/components/ui/hex-input";
import { RegistersPayload } from "./RegistersPayload";
import { invoke } from "@tauri-apps/api/tauri";

interface Props {
  registers: RegistersPayload;
}

export function UmpkRegistersControl({ registers }: Props) {
  function handleChange(registerName: string, data: number) {
    console.log({ registerName, data });
    invoke('umpk_set_register', { registerName, data }).then(() => console.log('good')).catch(e => console.error(e));
  }

  interface RegisterRecord {
    value: number;
    name: string;
  }

  const registerList = [
    ["A", registers.a],
    ["M", registers.m],
    ["B", registers.b],
    ["C", registers.c],
    ["D", registers.d],
    ["E", registers.e],
    ["H", registers.h],
    ["L", registers.l],
  ] as [string, number][];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
      {registerList.map((reg, i) => (
        <div key={i} className="flex items-center space-x-2 h-full">
          <Label className="w-8" htmlFor={reg[0]}>{reg[0]} </Label>
          <HexInput
            value={reg[1]}
            onBlur={(x) => handleChange(reg[0].toLowerCase(), x)}
            className="h-full"
            id={reg[0]}
            readOnly={reg[0] == "M"}
          />
        </div>
      ))}

      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label className="w-8" htmlFor="pc">PC</Label>
        <HexInput
          value={registers.pc}
          bytesLen={2}
          className="h-full"
          onBlur={(x) => handleChange("pc", x)}
          id="pc"
        />
      </div>
      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label className="w-8" htmlFor="sp">SP</Label>
        <HexInput
          value={registers.sp}
          bytesLen={2}
          className="h-full"
          onBlur={(x) => handleChange("sp", x)}
          id="sp"
        />
      </div>
    </div>
  );
}
