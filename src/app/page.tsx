"use client";

import Image from "next/image";

import { listen } from "@tauri-apps/api/event";

import { useEffect, useState } from "react";
import { SevenSegmentDisplay } from "./SevenSegmentDisplay";
import UmpkCodeEditor from "./UmpkCodeEditor";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import UmpkKeyboard from "@/components/umpk-keyboard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import UmpkIoOutput from "@/components/umpk-io-output";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

type TypePayload = {
  digit: number[];
  pg: number;
};

const UmpkDisplay = () => {
  const [data, setData] = useState([0, 0, 0, 0, 0, 0]);
  const [pg, setPg] = useState(0);

  useEffect(() => {
    console.log("JS Meow");

    const unlisten = listen("PROGRESS", (event) => {
      const pay = event.payload as TypePayload;

      setData(pay.digit);

      setPg(pay.pg);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const valueToList = (n: number, b = 8) =>
    [...Array(b)].map((x, i) => (n >> i) & 1).reverse();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-row">
          <SevenSegmentDisplay value={valueToList(data[0])} />
          <SevenSegmentDisplay value={valueToList(data[1])} />
          <SevenSegmentDisplay value={valueToList(data[2])} />
          <SevenSegmentDisplay value={valueToList(data[3])} />
        </div>
        <div className="flex flex-row ml-4">
          <SevenSegmentDisplay value={valueToList(data[4])} />
          <SevenSegmentDisplay value={valueToList(data[5])} />
        </div>
      </div>
      <h1 className="text-slate-100 w-full text-center">
        {pg.toString(16).padStart(4, "0")}
      </h1>
    </div>
  );
};

{
  value: 'R'
}

{
  value: 1
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-between">
      <ResizablePanelGroup className="min-h-screen" direction="horizontal">
        <ResizablePanel className="w-full">
          <UmpkCodeEditor />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex flex-col h-full px-4">
          <div className="flex items-center space-x-2 mb-2">
            <Switch id="umpk-on" />
            <Label htmlFor="on">Сеть</Label>
          </div>

          <UmpkDisplay />
          <UmpkIoOutput />
          <UmpkKeyboard />

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
    </main>
  );
}
