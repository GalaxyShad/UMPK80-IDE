use crate::umpk80_commands::{DisassembledLinePayload, Umpk80State};
use core::default::Default;
use csv::ReaderBuilder;
use log::__private_api::log;
use log::error;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::future::Future;
use std::io::{BufReader, Error, ErrorKind, Read, Stdout, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, ExitStatus};
use std::sync::Mutex;
use tauri::State;
use tempfile::TempDir;

pub struct TranslatorState {
    translator_path: Mutex<String>,
    translated_ram: Mutex<Vec<DisassembledLinePayload>>,
}

impl TranslatorState {
    pub fn new() -> Self {
        Self {
            translator_path: Mutex::new(String::from("i8080")),
            translated_ram: Mutex::new(Vec::new()),
        }
    }
}

#[tauri::command]
pub fn translator_set_execution_command(
    state: State<TranslatorState>,
    command: &str,
) -> Result<String, String> {
    let mut cmd = Command::new(command);

    let output = cmd
        .arg("--version")
        .output()
        .map_err(|err| format!("[Command error] {err}"))?;

    let mut translator_path = state.translator_path.lock().unwrap();

    *translator_path = String::from(command);

    let mut output_string = String::new();
    let mut err_output_string = String::new();
    BufReader::new(&output.stdout[..]).read_to_string(&mut output_string);
    BufReader::new(&output.stderr[..]).read_to_string(&mut err_output_string);

    Ok(output_string)
}

struct TryTranslateResult {
    run_command: String,

    stdout: String,
    stderr: String,
    exit_status: ExitStatus,

    result_binary_path: Option<PathBuf>,
    result_csv_path: Option<PathBuf>,
    result_word_path: Option<PathBuf>,
    result_markdown_path: Option<PathBuf>,
}

enum TryTranslateErrorType {
    TempDirCreate,
    TempAssemblyFileCreate,
    TempAssemblyFileWrite,
    ExecutableRun,
}

struct TryTranslateError {
    run_command: String,
    kind: TryTranslateErrorType,
    inner_error: Error,
}

fn try_translate(
    assembly_code: String,
    path_to_executable: String,
    generate_listing_word: bool,
    generate_listing_markdown: bool,
) -> Result<TryTranslateResult, TryTranslateError> {
    let temp_dir = TempDir::new().map_err(|err| TryTranslateError {
        run_command: "".to_string(),
        kind: TryTranslateErrorType::TempDirCreate,
        inner_error: err,
    })?;

    let source_file_path = Path::join(temp_dir.path(), "a.asm");

    let mut source_file = File::create(&source_file_path).map_err(|why| {
        error!("Cannot create temp file for translator. {}", why);

        TryTranslateError {
            run_command: "".to_string(),
            kind: TryTranslateErrorType::TempAssemblyFileCreate,
            inner_error: why,
        }
    })?;

    source_file
        .write_all(assembly_code.as_bytes())
        .map_err(|why| {
            error!("Unable to write source code to temp file. {}", why);

            TryTranslateError {
                run_command: "".to_string(),
                kind: TryTranslateErrorType::TempAssemblyFileWrite,
                inner_error: why,
            }
        })?;

    let mut command = Command::new(&path_to_executable);

    command.arg(&source_file_path);
    command.args([
        "--bin",
        "-c",
        if generate_listing_word { "-w" } else { "" },
        if generate_listing_markdown { "-m" } else { "" },
    ]);

    let run_command_string = format!("{:?}", command);

    let output = command.output().map_err(|err| TryTranslateError {
        run_command: run_command_string.clone(),
        kind: TryTranslateErrorType::ExecutableRun,
        inner_error: err,
    })?;

    let binary_file_path = Path::join(temp_dir.path(), "a.i8080asm.bin");
    let binary_word_path = Path::join(temp_dir.path(), "a.i8080asm.docx");
    let binary_markdown_path = Path::join(temp_dir.path(), "a.i8080asm.md");
    let result_markdown_path = Path::join(temp_dir.path(), "a.i8080asm.csv");

    Ok(TryTranslateResult {
        run_command: run_command_string.clone(),

        stdout: String::from_utf8(output.stdout.clone()).unwrap(),
        stderr: String::from_utf8(output.stderr.clone()).unwrap(),
        exit_status: output.status,

        result_binary_path: if binary_file_path.is_file() {
            Some(binary_file_path)
        } else {
            None
        },
        result_word_path: if binary_word_path.is_file() {
            Some(binary_word_path)
        } else {
            None
        },
        result_markdown_path: if binary_markdown_path.is_file() {
            Some(binary_markdown_path)
        } else {
            None
        },
        result_csv_path: if result_markdown_path.is_file() {
            Some(result_markdown_path)
        } else {
            None
        },
    })
}

#[derive(Serialize, Deserialize, Default)]
pub struct TranslateAndBuildPayload {
    run_command: String,

    stdout: String,
    stderr: String,

    binary_exists: bool,

    exit_status_display: String,
    exit_status_code: i32,
    exit_status_success: bool,
}

pub fn translate(
    assembly_code: String,
    path_to_executable: String,
    generate_listing_word: bool,
    generate_listing_markdown: bool,
) -> Result<TryTranslateResult, String> {
    return match try_translate(
        assembly_code,
        path_to_executable,
        generate_listing_word,
        generate_listing_markdown,
    ) {
        Ok(x) => Ok(x),
        Err(x) => Err(match x.kind {
            TryTranslateErrorType::TempDirCreate => {
                format!("🥺  Cannot create temp dir. {}", x.inner_error.to_string())
            }
            TryTranslateErrorType::TempAssemblyFileCreate => {
                format!(
                    "🥺  Cannot create temp file for translator. {}",
                    x.inner_error.to_string()
                )
            }
            TryTranslateErrorType::TempAssemblyFileWrite => {
                format!(
                    "🥺  Unable to write source code to temp file. {}",
                    x.inner_error.to_string()
                )
            }
            TryTranslateErrorType::ExecutableRun => {
                format!(
                        "🥺  Unable to run translator executable \"{}\".\n\
                    Reason: {}\n\
                    Message: {}\n\
                    {}",
                        x.run_command,
                        x.inner_error.kind().to_string(),
                        x.inner_error.to_string(),
                        match x.inner_error.kind() {
                            ErrorKind::NotFound => "💡  Hint: check that executable \"i8080\" of translator \"SomeIntel8080Translator\" is in $PATH variables or configure custom path in IDE settings",
                            _ => ""
                        }
                    )
            }
        }),
    };
}

#[tauri::command]
pub async fn translate_and_build(
    umpk_state: State<'_, Umpk80State>,
    assembly_code: String,
    path_to_executable: String,
    dst_ram_offset: u16,
) -> Result<TranslateAndBuildPayload, String> {
    let translate_result = translate(assembly_code, path_to_executable, false, false)?;

    let mut binary_exists = false;
    if let Some(binary_path) = translate_result.result_binary_path {
        let mut binary_file = File::open(&binary_path).map_err(|err| {
            format!(
                "Can't open result binary file \"{:?}\". {}",
                binary_path,
                err.to_string()
            )
        })?;

        let mut binary_data = Vec::new();
        binary_file.read_to_end(&mut binary_data).map_err(|err| {
            format!(
                "Can't read result binary file \"{:?}\". {}",
                binary_path,
                err.to_string()
            )
        })?;

        let umpk80 = umpk_state.0.lock().unwrap();
        umpk80.load_program(&binary_data, binary_data.len() as u16, dst_ram_offset);

        binary_exists = true;
    }

    if let Some(csv_path) = translate_result.result_csv_path {
        let mut rdr = csv::Reader::from_path(csv_path);
        for result in rdr.unwrap().records() {
            // The iterator yields Result<StringRecord, Error>, so we check the
            // error here.
            let record = result.map_err(|e| e.to_string())?;
            println!("{:?}", record);
        }
    }

    return Ok(TranslateAndBuildPayload {
        run_command: translate_result.run_command,

        stdout: translate_result.stdout,
        stderr: translate_result.stderr,

        exit_status_display: translate_result.exit_status.to_string(),
        exit_status_code: translate_result.exit_status.code().unwrap_or_else(|| -1),
        exit_status_success: translate_result.exit_status.success(),

        binary_exists,
    });
}

#[cfg(test)]
mod tests {
    use std::fs::File;
    use std::io::Read;
    use crate::translator_commands::{translate, translate_and_build};
    use crate::umpk80_lib::{Umpk80, Umpk80Register};

    #[test]
    fn test_generate_binary() {
        let res = translate(
            "ORG 0800h".to_string(),
            "i8080".to_string(),
            false,
            false)
            .unwrap();

        assert_eq!(res.exit_status.success(), true)
    }

    #[test]
    fn test_load_binary() {
        let res = translate(
            "DAA".to_string(),
            "i8080".to_string(),
            false,
            false)
            .unwrap();

        assert!(res.result_binary_path.is_some());

        let mut binary_file = File::open(&res.result_binary_path.unwrap()).unwrap();

        let mut binary_data = Vec::new();
        binary_file.read_to_end(&mut binary_data);

        assert_eq!(binary_data[0], 0x27)
    }
}
