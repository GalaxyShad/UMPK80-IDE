import { Err, Ok, Result } from '@/lib/result.ts'
import { invoke } from '@tauri-apps/api/tauri'

async function tryOrErrorAsString<T>(cb: () => Promise<T>): Promise<Result<T>> {
  try {
    return Ok(await cb())
  } catch (e) {
    return Err(e as string)
  }
}

export interface TranslateAndRunResult {
  run_command: string,

  stdout: string,
  stderr: string,

  binary_exists: boolean,

  exit_status_display: string,
  exit_status_code: number,
  exit_status_success: boolean,
}

export const translateAndBuild = async (assemblyCode: string, pathToExecutable: string, dstRamOffset: number): Promise<Result<TranslateAndRunResult>> => {
    try {
      return Ok(await invoke<TranslateAndRunResult>('translate_and_build', { assemblyCode, pathToExecutable, dstRamOffset }))
    } catch (e) {
      return Err(e as string)
    }
}

export const loadSourceCodeFromFile = async (filePath: string): Promise<Result<string>> =>
  tryOrErrorAsString(async () =>
    await invoke<string>('load_source_code_from_file', { filePath }))

export const saveSourceCodeToFile = async (filePath: string, sourceCode: string): Promise<Result> =>
  tryOrErrorAsString(async () =>
    await invoke('save_source_code_to_file', { filePath, sourceCode }))