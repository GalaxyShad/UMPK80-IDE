// prettier-ignore
import { invoke } from '@tauri-apps/api/tauri'

export enum KeyboardKey {
  _D, _E, _F,
  _A, _B, _C,
  _7, _8, _9,
  _4, _5, _6,
  _1, _2, _3,
  _0, ZP_UV, UM,
  P, OT_RG, OT_A,
  SHK, PR_SCH, SHC,
  R, ST
}

export type RegisterName =
  'a' | 'psw' |
  'b' | 'c' |
  'd' | 'e' |
  'h' | 'l' |
  'pc' | 'sp' |
  'm';

export interface UMPK80State {
  display: [number, number, number, number, number, number],
  io: number,
  pg: number,
  registers: UMPK80StateRegistersPayload,
  display_address: number,
  ioInput: number
}

export type UMPK80StateRegistersPayload = Record<RegisterName, number>;

export interface UMPK80DisassembledLine {
  address: number,
  mnemonic: string,
  arguments: number[],
  bytes: number[],
}


export async function umpkPressKey(key: KeyboardKey) {
  await invoke('umpk_press_key', { key })
}

export async function umpkReleaseKey(key: KeyboardKey) {
  await invoke('umpk_release_key', { key })
}

export async function umpkSetIoInput(io: number) {
  await invoke('umpk_set_io_input', { io })
}

export async function umpkSetSpeakerVolume(volume: number) {
  await invoke('umpk_set_speaker_volume', { volume })
}

export async function umpkGetROM(): Promise<Uint8Array> {
  return await invoke<Uint8Array>('umpk_get_rom')
}

export async function umpkGetRAM(): Promise<Uint8Array> {
  return await invoke<Uint8Array>('umpk_get_ram')
}

export async function umpkSetRegister(registerName: RegisterName, data: number) {
  await invoke('umpk_set_register', { registerName, data })
}

export async function umpkGetState(): Promise<UMPK80State> {
  return await invoke<UMPK80State>('umpk_get_state')
}

export async function umpkGetDisassembledROM(): Promise<UMPK80DisassembledLine[]> {
  return await invoke<UMPK80DisassembledLine[]>('umpk_get_disassembled_rom')
}

export async function umpkWriteToMemory(address: number, data: number) {
  await invoke('umpk_write_to_memory', { address, data })
}