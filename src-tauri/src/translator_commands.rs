use core::default::Default;
use std::fmt;
use std::fmt::{Debug, Formatter};
use std::fs::File;
use std::future::Future;
use std::io::{BufRead, BufReader, Error, Read, Write};
use std::path::{Path, PathBuf};
use std::process::{ExitStatus, Output};
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::State;
use tempfile::TempDir;

use crate::translator_lib::SomeIntel8080Translator;
use crate::umpk80_commands::DisassembledLinePayload;

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
    exe_path: &str,
) -> Result<String, String> {
    let res = SomeIntel8080Translator::new(Path::new(exe_path))
        .version()
        .execute()
        .map_err(|err| err.to_string())?;

    Ok(String::from_utf8(res.stdout).unwrap())
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
    SourceCodeCreateTempFile,
    ExecutableRun,
    BinaryFileOpen,
}

struct TryTranslateError {
    kind: TryTranslateErrorType,
    inner: Error,
}

impl fmt::Display for TryTranslateError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.inner)
    }
}

impl Debug for TryTranslateError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.inner)
    }
}

fn make_temp_assembly_source_code_file(
    source_code: &str,
) -> Result<(TempDir, File, PathBuf), Error> {
    let temp_dir = TempDir::new()?;

    let source_file_path = Path::join(temp_dir.path(), "a.asm");

    let mut source_file = File::create(&source_file_path)?;
    source_file.write_all(source_code.as_bytes())?;

    Ok((temp_dir, source_file, source_file_path))
}

struct TranslateAssemblyToBinaryResult {
    output: Output,
    binary_data: Vec<u8>,
}

fn translate_assembly_to_binary(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<TranslateAssemblyToBinaryResult, TryTranslateError> {
    let (temp_dir, temp_src_file, temp_src_file_path) =
        make_temp_assembly_source_code_file(source_code).map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::SourceCodeCreateTempFile,
            inner: err,
        })?;

    let translate_output = SomeIntel8080Translator::new(translator_exe_path)
        .source_code_path(&temp_src_file_path)
        .binary()
        .csv()
        .execute()
        .map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::ExecutableRun,
            inner: err,
        })?;

    let binary_file_path = temp_src_file_path.with_extension("i8080asm.bin");
    let csv_file_path = temp_src_file_path.with_extension("i8080asm.csv");

    let mut binary_data = Vec::new();

    if binary_file_path.is_file() {
        let mut binary_file = File::open(&binary_file_path).map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::BinaryFileOpen,
            inner: err,
        })?;
        binary_file
            .read_to_end(&mut binary_data)
            .map_err(|err| TryTranslateError {
                kind: TryTranslateErrorType::BinaryFileOpen,
                inner: err,
            })?;
    }

    if binary_file_path.is_file() {
        let output_str = String::from_utf8(translate_output.stdout.clone()).unwrap();

        for i in output_str.split("\n").skip(1) {}
    }

    Ok(TranslateAssemblyToBinaryResult {
        output: translate_output,
        binary_data,
    })
}

#[derive(Serialize, Deserialize)]
pub struct AssemblyListingLine {
    pub address: Option<u16>,
    pub bytes: Vec<u8>,
    pub label: String,
    pub assembly_code: String,
    pub comment: String,
}

fn parse_assembly_line(line: &str) -> AssemblyListingLine {
    let parts: Vec<&str> = line.split(['|', ';']).collect();
    if parts.len() < 5 {
        panic!("Invalid format");
    }

    let address = match u16::from_str_radix(parts[0].trim(), 16) {
        Ok(x) => Some(x),
        Err(_) => None,
    };

    let bytes_str = parts[1].trim();
    println!("{:?}", bytes_str);
    let bytes: Vec<u8> = bytes_str
        .chars()
        .collect::<Vec<char>>()
        .chunks(2)
        .map(|chunk| u8::from_str_radix(&chunk.iter().collect::<String>(), 16).unwrap())
        .collect();

    let label = parts[2].trim().to_string();

    let assembly_code = parts[3].trim().to_string();

    let comment = parts[4].trim().to_string();

    AssemblyListingLine {
        address,
        label,
        assembly_code,
        bytes,
        comment,
    }
}

pub fn parse_monitor_system() -> Vec<AssemblyListingLine> {
    let file = File::open("./monitor.i8080asm.txt").unwrap();

    BufReader::new(file)
        .lines()
        .skip(1)
        .flatten()
        .map(|x| parse_assembly_line(&x))
        .collect()
}

#[derive(Serialize, Deserialize)]
pub struct TranslateAndBuildPayload {
    run_command: String,

    stdout: String,
    stderr: String,

    binary_exists: bool,

    exit_status_display: String,
    exit_status_code: i32,
    exit_status_success: bool,
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::translator_commands::{
        parse_assembly_line, parse_monitor_system, translate_assembly_to_binary,
    };

    #[test]
    fn test__translate_assembly_to_binary__first_element_is_27() {
        let res = translate_assembly_to_binary("DAA", Path::new("i8080")).unwrap();

        assert_eq!(res.binary_data[0], 0x27);
    }

    #[test]
    fn test__parse_assembly_line() {
        let res = parse_assembly_line("1234 | 21AF12 | MLA:  | LXI H,12AFH ; SOME COMMENT  ");

        assert_eq!(res.address.unwrap(), 0x1234);

        assert_eq!(res.bytes[0], [0x21, 0xAF, 0x12]);
        assert_eq!(res.label, "MLA:");

        assert_eq!(res.assembly_code, "LXI H,12AFH");
        assert_eq!(res.comment, "SOME COMMENT");
    }

    #[test]
    fn test__parse_assembly_line__empty() {
        let res = parse_assembly_line(" |  |   |  ;  ");

        assert!(res.address.is_none());

        assert_eq!(res.bytes.len(), 0);

        assert_eq!(res.label, "");

        assert_eq!(res.assembly_code, "");
        assert_eq!(res.comment, "");
    }

    #[test]
    fn test__parse_monitor_system() {
        let res = parse_monitor_system();

        let line105 = &res[103];

        assert_eq!(line105.address, Some(0x0041));
        assert_eq!(line105.bytes, [0xC2, 0xC8, 0x00]);
        assert_eq!(line105.label, "");
        assert_eq!(line105.assembly_code, "JNZ PPER");
        assert_eq!(
            line105.comment,
            "- ЕСЛИ НЕТ (ПОПАЛИ НА RST 0 ИЗ-ЗА ОШИБКИ СТЕКА ПОЛЬЗОВАТЕЛЯ)"
        );
    }
}
