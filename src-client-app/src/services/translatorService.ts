import { Err, Ok, Result } from '@/lib/result.ts'
import { invoke } from '@tauri-apps/api/tauri'

async function tryOrErrorAsString<T>(cb: () => Promise<T>): Promise<Result<T>> {
  try {
    return Ok(await cb())
  } catch (e) {
    return Err(e as string)
  }
}

type TranslateAndRunResult = [string, Uint8Array];
export const translateAndRun = async (sourceCode: string): Promise<Result<TranslateAndRunResult>> =>
  tryOrErrorAsString(async () =>
    await invoke<TranslateAndRunResult>('process_string', { inputString: sourceCode }))

export const loadSourceCodeFromFile = async (filePath: string): Promise<Result<string>> =>
  tryOrErrorAsString(async () =>
    await invoke<string>('load_source_code_from_file', { filePath }))

export const saveSourceCodeToFile = async (filePath: string, sourceCode: string): Promise<Result> =>
  tryOrErrorAsString(async () =>
    await invoke('save_source_code_to_file', { filePath, sourceCode }))