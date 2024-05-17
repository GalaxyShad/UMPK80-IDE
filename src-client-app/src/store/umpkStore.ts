import { create } from 'zustand'
import {
  KeyboardKey,
  RegisterName,
  UMPK80State,
  UMPK80StateRegistersPayload, umpkGetStack,
  umpkGetState,
  umpkPressKey,
  umpkReleaseKey, umpkRunFromAddress,
  umpkSetIoInput,
  umpkSetRegister,
  umpkSetSpeakerVolume,
} from '@/services/umpkService.ts'

interface UMPK80Actions {
  pressKey: (key: KeyboardKey) => Promise<void>,
  releaseKey: (key: KeyboardKey) => Promise<void>,
  setIOInput: (io: number) => Promise<void>,
  setSpeakerVolume: (volume: number) => Promise<void>,
  setRegister: (registerName: RegisterName, data: number) => Promise<void>,
  runFromAddress: (address: number) => Promise<void>,
  getStack: () => Promise<Uint8Array>
}

type UMPK80StoreState = UMPK80State & UMPK80Actions;

export const useUMPK80Store = create<UMPK80StoreState>()((setState) => {
  const updateState = async () => {
    const newState = await umpkGetState()

    setState({
      ...newState,
      registers: { ...newState.registers },
      display: { ...newState.display },
    })

    window.requestAnimationFrame(updateState)
  }

  window.requestAnimationFrame(updateState)

  return {
    io: 0x00,
    pg: 0x0000,
    registers: {} as UMPK80StateRegistersPayload,
    display: [0, 0, 0, 0, 0, 0],
    ioInput: 0xFF,

    pressKey: async (key: KeyboardKey) => await umpkPressKey(key),
    releaseKey: async (key: KeyboardKey) => await umpkReleaseKey(key),

    runFromAddress: async (address: number) => await umpkRunFromAddress(address),

    setIOInput: async (io: number) => {
      await umpkSetIoInput(io)
      setState({ ioInput: io })
    },

    setRegister: async (registerName: RegisterName, data: number) => {
      await umpkSetRegister(registerName, data)
      setState((state) => ({ registers: { ...state.registers, [registerName]: data } }))
    },

    setSpeakerVolume: async (volume: number) => {
      await umpkSetSpeakerVolume(volume)
    },

    getStack: async (): Promise<Uint8Array> => await umpkGetStack(),
  } as UMPK80StoreState
})