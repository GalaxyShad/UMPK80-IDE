import { Err, Ok, Result } from '@/lib/result.ts'
import { invoke } from '@tauri-apps/api/tauri'

async function tryOrErrorAsString<T>(cb: () => Promise<T>): Promise<Result<T>> {
  try {
    return Ok(await cb())
  } catch (e) {
    return Err(e as string)
  }
}

export interface AssemblyListingLine {
  address: number | null,
  bytes: number[],
  label: string,
  assemblyCode: string,
  comment: string,
}

export interface TranslateAndRunResult {
  stdout: string,
  stderr: string,

  listing: AssemblyListingLine[],
  binaryExists: boolean,

  exitStatusDisplay: string,
  exitStatusCode: number,
  exitStatusSuccess: boolean,
}

export const translatorGetMonitorSystem = async (): Promise<Result<AssemblyListingLine[]>> => {
  try {
    type T = AssemblyListingLine extends { name: string }
      ? Omit<AssemblyListingLine, 'assemblyCode'> & {assembly_code: string}
      : AssemblyListingLine

    const res = await invoke<T[]>('translator_get_monitor_system')

    return Ok(res.map(x => ({
      address: x.address,
      bytes: x.bytes,
      label: x.label,
      comment: x.comment,
      assemblyCode: (x as any).assembly_code
    })))
  } catch (e) {
    return Err(e as string)
  }
}

export const translatorGetVersion = async (exePath: string) => {
  try {
    return Ok(await invoke<string>('translator_version', { exePath }))
  } catch (e) {
    return Err(e as string)
  }
}

export type TranslateToType = 'csv' | 'docx' | 'markdown' | 'txt'

export const translateTo = async (
  to: TranslateToType,
  sourceCode: string,
  exePath: string,
): Promise<Result<undefined, string>> => {
  try {
    await invoke('translator_export_to', { to, sourceCode, exePath })
    return Ok(undefined)
  } catch (e) {
    return Err(e as string)
  }
}

export const translateAndBuild = async (sourceCode: string, exePath: string, ramShift: number): Promise<Result<TranslateAndRunResult>> => {
  try {
    const res = await invoke('translator_build', {
      sourceCode,
      exePath,
      ramShift,
    }) as unknown as {
      stdout: string,
      stderr: string,

      listing: {
        address?: number,
        bytes: number[],
        label: string,
        assembly_code: string,
        comment: string,
      }[],
      binary_exists: boolean,

      exit_status_display: string,
      exit_status_code: number,
      exit_status_success: boolean,
    }

    return Ok({
      stdout: res.stdout,
      stderr: res.stderr,

      binaryExists: res.binary_exists,
      listing: res.listing.map(x => ({
        assemblyCode: x.assembly_code,
        comment: x.comment,
        label: x.label,
        bytes: x.bytes,
        address: x.address,
      } as AssemblyListingLine)),

      exitStatusCode: res.exit_status_code,
      exitStatusSuccess: res.exit_status_success,
      exitStatusDisplay: res.exit_status_display,
    } as TranslateAndRunResult)
  } catch (e) {
    return Err(e as string)
  }
}

export const loadSourceCodeFromFile = async (filePath: string): Promise<Result<string>> =>
  tryOrErrorAsString(async () =>
    await invoke<string>('editor_load_source_code_from_file', { filePath }))

export const saveSourceCodeToFile = async (filePath: string, sourceCode: string): Promise<Result> =>
  tryOrErrorAsString(async () =>
    await invoke('editor_save_source_code_to_file', { filePath, sourceCode }))