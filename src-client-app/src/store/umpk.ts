import {create} from "zustand";

export interface RegistersPayload {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  psw: number;
  m: number;
  sp: number;
  pc: number;
}

export interface UMPK80State {
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
  registers: {} as RegistersPayload
}))