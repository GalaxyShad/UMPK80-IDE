use std::fmt::Error;
use std::io::{stderr, stdout};
use std::path::Path;
use std::sync::{Arc, Mutex};

use serde::{Deserialize, Serialize};
use tauri::State;
use tempfile::TempDir;

use crate::translator_lib::SomeIntel8080Translator;
use crate::translator_service::{
    parse_monitor_system, translate_assembly_to_binary, translate_to_csv_and_open,
    translate_to_docx_and_open, translate_to_markdown_and_open, translate_to_txt_and_open,
    AssemblyListingLine, TryTranslateErrorType,
};
use crate::umpk80_commands::Umpk80State;
use crate::umpk80_lib::Umpk80;

pub struct TempDirState(pub Arc<Mutex<TempDir>>);

impl TempDirState {
    pub fn new() -> Self {
        let temp_dir = TempDir::new().unwrap_or_else(|_| panic!("Failed to create temporary directory"));
        let temp_dir = Arc::new(Mutex::new(temp_dir));

        Self(temp_dir)
    }
}

#[derive(Serialize, Deserialize)]
pub struct TranslateAndBuildPayload {
    stdout: String,
    stderr: String,

    listing: Vec<AssemblyListingLine>,
    binary_exists: bool,

    exit_status_display: String,
    exit_status_code: i32,
    exit_status_success: bool,
}

#[tauri::command]
pub async fn translator_version(exe_path: String) -> Result<String, String> {
    let res = SomeIntel8080Translator::new(Path::new(&exe_path))
        .version()
        .execute()
        .map_err(|err| err.to_string())?;

    let stderr_string = String::from_utf8(res.stderr).unwrap();
    let stdout_string = String::from_utf8(res.stdout).unwrap();

    Ok(if stderr_string == "" { stdout_string } else { stderr_string })
}

#[tauri::command]
pub async fn translator_export_to(
    temp_dir: State<'_, TempDirState>,
    to: String,
    source_code: String,
    exe_path: String,
) -> Result<(), String> {
    let temp_path = temp_dir.0.lock().unwrap();

    match to.to_lowercase().as_str() {
        "csv" => translate_to_csv_and_open(temp_path.path(), &source_code, Path::new(&exe_path))
            .map_err(|e| e.to_string())?,
        "docx" => translate_to_docx_and_open(temp_path.path(), &source_code, Path::new(&exe_path))
            .map_err(|e| e.to_string())?,
        "markdown" => translate_to_markdown_and_open(temp_path.path(), &source_code, Path::new(&exe_path))
            .map_err(|e| e.to_string())?,
        "txt" => translate_to_txt_and_open(temp_path.path(), &source_code, Path::new(&exe_path))
            .map_err(|e| e.to_string())?,
        _ => (),
    };

    Ok(())
}

#[tauri::command]
pub async fn translator_build(
    umpk80state: State<'_, Umpk80State>,
    temp_dir: State<'_, TempDirState>,
    source_code: String,
    exe_path: String,
    ram_shift: u16,
) -> Result<TranslateAndBuildPayload, String> {
    let temp_path = temp_dir.0.lock().unwrap();

    let res =
        translate_assembly_to_binary(temp_path.path(), &source_code, Path::new(&exe_path)).map_err(
            |err| match err.kind {
                TryTranslateErrorType::SourceCodeCreateTempFile => {
                    format!("Cannot create source code file :(. {}", err.inner)
                }
                TryTranslateErrorType::ExecutableRun => err.inner.to_string(),
                TryTranslateErrorType::BinaryFileOpen => {
                    format!("Cannot read assembled code :(. {}", err.inner)
                }
            },
        )?;

    if !res.binary_data.is_empty() {
        let umpk = umpk80state.0.lock().unwrap();
        umpk.load_program(&res.binary_data, res.binary_data.len() as u16, ram_shift);
    }

    Ok(TranslateAndBuildPayload {
        stdout: String::from_utf8(res.output.stdout).unwrap(),
        stderr: String::from_utf8(res.output.stderr).unwrap(),

        listing: res.listing_data,
        binary_exists: !res.binary_data.is_empty(),

        exit_status_display: res.output.status.to_string(),
        exit_status_code: res.output.status.code().unwrap_or_default(),
        exit_status_success: res.output.status.success(),
    })
}

#[tauri::command]
pub async fn translator_get_monitor_system(
    handle: tauri::AppHandle,
) -> Result<Vec<AssemblyListingLine>, String> {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("monitor.i8080asm.txt");

    if resource_path.is_none() {
        return Err("Cannot find \"monitor.i8080asm.txt\" in resources".to_string());
    }

    Ok(parse_monitor_system(&resource_path.unwrap()))
}
