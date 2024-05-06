import {create} from "zustand";
import {invoke} from "@tauri-apps/api/tauri";

interface TranslatorState {
  translateCommand: string,

  setTranslateCommand: (command: string) => Promise<Result<string>>,
}

type Result<T, E = string> = { ok: true, value: T } | { ok: false, error: E | undefined };

const Ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data };
};

const Err = <E>(error?: E): Result<never, E> => {
  return { ok: false, error };
};

export const useTranslatorStore = create<TranslatorState>()(( set ) => ({
  translateCommand: "i8080",
  setTranslateCommand: async (command: string): Promise<Result<string>> => {
    try {
      const result = await invoke("translator_set_execution_command", { command });

      set(state => ({ ...state, translateCommand: command }));

      return Ok(result as string)
    } catch (e) {
      return Err(e as string)
    }
  },
}))