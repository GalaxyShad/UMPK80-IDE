import React, { useEffect, useRef, useState } from "react";
import { Switch } from "./ui/switch";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { UmpkDisplay } from "./umpk-display";
import { UmpkIOPortOutput, UmpkIOPortInput } from "./umpk-io-output";
import { UmpkKeyboardControl, UmpkKeyboardNumber } from "./umpk-keyboard";
import { UmpkRegistersControl } from "./umpk-registers-control";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { listen } from "@tauri-apps/api/event";
import { RegistersPayload } from "./RegistersPayload";
import { Toggle } from "./ui/toggle";

type Props = {};

interface TypePayload {
  digit: number[];
  io: number;
  pg: number;
  registers: RegistersPayload;
}

export default function UmpkTab({}: Props) {
  const [umpkData, setUmpkData] = useState<TypePayload>({
    digit: [0, 0, 0, 0, 0, 0],
    io: 0,
    pg: 0,
    registers: {} as RegistersPayload,
  });

  const [registers, setRegisters] = useState<RegistersPayload>(
    {} as RegistersPayload
  );
  const refUmpk = useRef<HTMLDivElement>(null);

  async function setIOInput(hex: number) {
    console.log({ hex });
    await invoke("umpk_set_io_input", { io: hex });
  }

  useEffect(() => {
    const unlisten = listen("PROGRESS", (event) => {
      const pay = event.payload as TypePayload;
      // console.log({pay});
      setUmpkData({ ...pay });
      setRegisters({ ...pay.registers });
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <Switch id="umpk-on" />
        <Label htmlFor="umpk-on">Сеть</Label>
      </div>

      <UmpkDisplay digit={umpkData.digit} pg={umpkData.pg} />

      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <UmpkFlags
          psw={registers.psw}
          onPswChange={(data) =>
            invoke("umpk_set_register", { registerName: "psw", data })
          }
        />

        <div className="bg-card flex flex-row gap-2 font-semibold justify-end rounded px-2 py-1">
          <Slider />
        </div>

        <UmpkRegistersControl registers={registers} />

        <div className="flex flex-col justify-between gap-2">
          <UmpkIOPortOutput value={umpkData.io} />
          <UmpkIOPortInput onChange={setIOInput} />
        </div>

        <UmpkKeyboardControl />
        <UmpkKeyboardNumber />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={async () => {
            await invoke("start_umpk80", {
              window: appWindow,
            });
          }}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Run{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={`m-0 max-w-[30ch] text-sm opacity-50`}
          >{`Let's Rock`}</p>
        </a>
      </div>
    </div>
  );
}

interface UmpkFlagsProps {
  psw: number;
  onPswChange: (psw: number) => void;
}

function UmpkFlags({ psw, onPswChange }: UmpkFlagsProps) {
  interface Flag {
    name: string;
    mask: number;
  }

  const flags = [
    { name: "S", mask: 0b10000000 },
    { name: "Z", mask: 0b01000000 },
    { name: "AC", mask: 0b00010000 },
    { name: "P", mask: 0b00000100 },
    { name: "C", mask: 0b00000001 },
  ] as Flag[];

  function handleChange(mask: number, pressed: boolean) {
    onPswChange(pressed ? psw | mask : psw & ~mask);
  }

  return (
    <div className="bg-card flex flex-row gap-1 font-semibold justify-end rounded px-2 py-1">
      {flags.map((flag, i) => (
        <Toggle
          key={i}
          pressed={(psw & flag.mask) != 0}
          onPressedChange={(pressed) => handleChange(flag.mask, pressed)}
          size="sm"
        >
          {flag.name}
        </Toggle>
      ))}
    </div>
  );
}
