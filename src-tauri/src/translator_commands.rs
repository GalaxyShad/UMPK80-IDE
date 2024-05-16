use std::error::Error;
use std::path::Path;

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::translator_lib::SomeIntel8080Translator;
use crate::translator_service::{
    translate_assembly_to_binary, AssemblyListingLine, TryTranslateErrorType,
};
use crate::umpk80_commands::Umpk80State;

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
pub async fn translator_version(
    command: String,
    exe_path: String,
) -> Result<String, String> {
    let res = SomeIntel8080Translator::new(Path::new(&exe_path))
        .version()
        .execute()
        .map_err(|err| err.to_string())?;

    Ok(String::from_utf8(res.stdout).unwrap())
}

#[tauri::command]
pub async fn translator_build(
    umpk80state: State<'_, Umpk80State>,
    source_code: String,
    exe_path: String,
    ram_shift: u16,
) -> Result<TranslateAndBuildPayload, String> {
    let res =
        translate_assembly_to_binary(&source_code, Path::new(&exe_path)).map_err(
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
