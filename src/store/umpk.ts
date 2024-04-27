import {useEffect} from "react";
import {listen, UnlistenFn} from "@tauri-apps/api/event";
import {create} from "zustand";
import {RegistersPayload} from "@/components/RegistersPayload";

interface UMPK80State {
  digit: number[];
  io: number;
  pg: number;
  stack: number[];
  stackStart: number;
  registers: RegistersPayload;
}


export const useUMPK80Store = create<UMPK80State>()(() => ({
  digit: [0, 0, 0, 0, 0, 0],
  io: 0x00,
  pg: 0x0000,
  stack: [],
  stackStart: 0x0000,
  registers: {} as RegistersPayload,

}))

export const startListeningUMPK80 = async (): Promise<UnlistenFn> => await listen<UMPK80State>("PROGRESS", (event) => {
  useUMPK80Store.setState((state) => ({
    ...event.payload,
    digit: [...event.payload.digit],
    registers: {...event.payload.registers},
    stack: [...event.payload.stack],
  }));
});
