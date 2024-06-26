import { create } from 'zustand'
import {
  KeyboardKey,
  RegisterName,
  UMPK80State,
  UMPK80StateRegistersPayload, umpkGetStack,
  umpkGetState, umpkPressKey,
  umpkReleaseKey, umpkRunFromAddress,
  umpkSetIoInput,
  umpkSetRegister,
  umpkSetSpeakerVolume,
} from '@/services/umpkService.ts'
import { AssemblyListingLine } from '@/services/translatorService.ts'

interface UMPK80Actions {
  pressKey: (key: KeyboardKey) => Promise<void>,
  releaseKey: (key: KeyboardKey) => Promise<void>,
  setIOInput: (io: number) => Promise<void>,
  setSpeakerVolume: (volume: number) => Promise<void>,
  setRegister: (registerName: RegisterName, data: number) => Promise<void>,
  runFromAddress: (address: number) => Promise<void>,
  getStack: () => Promise<Uint8Array>,
  updateRamListing: (listing: AssemblyListingLine[]) => void,
  clearRamListing: () => void,
}

type UMPK80StoreState = UMPK80State & UMPK80Actions & {
  ramListing: AssemblyListingLine[],
  speakerVolume: number,
};

const defaultRamListing = [] as AssemblyListingLine[]

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
    ramListing: [...defaultRamListing],
    speakerVolume: 0,

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
      setState({
        speakerVolume: volume,
      })
    },

    getStack: async (): Promise<Uint8Array> => await umpkGetStack(),

    updateRamListing: (listing: AssemblyListingLine[]) => setState({ ramListing: [...listing] }),

    clearRamListing: () => setState({ ramListing: [...defaultRamListing] }),
  } as UMPK80StoreState
})