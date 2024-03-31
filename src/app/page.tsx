"use client";

import Image from "next/image";

import { listen } from "@tauri-apps/api/event";

import { useEffect, useState } from "react";
import { SevenSegmentDisplay } from "../components/seven-segment-display";
import UmpkCodeEditor from "../components/umpk-code-editor";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import {
  UmpkKeyboardControl,
  UmpkKeyboardNumber,
} from "@/components/umpk-keyboard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UmpkIOPortInput, UmpkIOPortOutput } from "@/components/umpk-io-output";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input, InputProps } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type TypePayload = {
  digit: number[];
  pg: number;
};

const UmpkDisplay = () => {
  const [data, setData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [pg, setPg] = useState(0);

  useEffect(() => {
    const unlisten = listen("PROGRESS", (event) => {
      const pay = event.payload as TypePayload;

      setData(pay.digit);

      setPg(pay.pg);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-row">
          <SevenSegmentDisplay value={data[0]} />
          <SevenSegmentDisplay value={data[1]} />
          <SevenSegmentDisplay value={data[2]} />
          <SevenSegmentDisplay value={data[3]} />
        </div>
        <div className="flex flex-row ml-4">
          <SevenSegmentDisplay value={data[4]} />
          <SevenSegmentDisplay value={data[5]} />
        </div>
      </div>
      <h1 className="text-slate-100 w-full text-center">
        {pg.toString(16).padStart(4, "0")}
      </h1>
    </div>
  );
};

function UmpkRegistersControl() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="a">A</Label>
        <Input className="h-full" id="a" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="m">M</Label>
        <Input className="h-full" readOnly id="m" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="b">B</Label>
        <Input className="h-full" id="b" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="c">C</Label>
        <Input className="h-full" id="c" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="d">D</Label>
        <Input className="h-full" id="d" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="e">E</Label>
        <Input className="h-full" id="e" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="h">H</Label>
        <Input className="h-full" id="h" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="l">L</Label>
        <Input className="h-full" id="l" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex h-full flex-row">
      <div className="w-12 h-full bg-card">Menu placeholder</div>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row py-1 px-2">
          <Button className="h-6 w-6" variant="outline" size="icon" />
        </div>
        <ResizablePanelGroup className="h-full w-full" direction="horizontal">
          <ResizablePanel className="w-full">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel className="w-full">
                <UmpkCodeEditor />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel className="w-full"></ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="flex flex-col h-full px-4 gap-4 items-center">
            <div className="flex items-center space-x-2 mb-2">
              <Switch id="umpk-on" />
              <Label htmlFor="umpk-on">Сеть</Label>
            </div>

            <UmpkDisplay />

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="bg-card flex flex-row gap-2 font-semibold justify-end rounded px-2 py-1">
                {["S", "Z", "AC", "P", "C"].map((x, i) => (
                  <div key={i}>{x}</div>
                ))}
              </div>

              <div className="bg-card flex flex-row gap-2 font-semibold justify-end rounded px-2 py-1">
                <Slider />
              </div>

              <UmpkRegistersControl />

              <div className="flex flex-col justify-between gap-2">
                <UmpkIOPortOutput />
                <UmpkIOPortInput />
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
