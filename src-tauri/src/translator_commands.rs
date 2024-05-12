use std::fs::File;
use std::io::{BufReader, Read, Write};
use std::path::Path;
use std::process::Command;
use std::sync::Mutex;
use tauri::State;
use tempfile::TempDir;
use crate::umpk80_commands::Umpk80State;

pub struct TranslatorState {
    translator_path: Mutex<String>,
}

impl TranslatorState {
    pub fn new() -> Self {
        Self {
            translator_path: Mutex::new(String::from("i8080")),
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

#[tauri::command]
pub fn process_string(
    state: State<TranslatorState>,
    umpk_state: State<Umpk80State>,
    input_string: String,
) -> Result<(String, Vec<u8>), String> {
    let temp_dir = TempDir::new().map_err(|x| x.to_string())?;
    let source_file_path = Path::join(temp_dir.path(), "a.asm");

    let mut source_file = File::create(&source_file_path).map_err(|x| x.to_string())?;

    source_file
        .write_all(input_string.as_bytes())
        .map_err(|x| x.to_string())?;

    let translator_path = state.translator_path.lock().unwrap();

    let mut command = Command::new(translator_path.as_str());

    let output = command
        .arg(source_file_path.as_os_str())
        .arg("-b")
        .output()
        .map_err(|err| err.kind().to_string())?;

    if !output.status.success() {
        return Err("Command execution failed".to_string());
    }

    let mut output_string = String::new();
    BufReader::new(&output.stdout[..]).read_to_string(&mut output_string);

    let binary_file_path = Path::join(temp_dir.path(), "a.i8080asm.bin");

    println!("{}", binary_file_path.display());

    let mut binary_file = File::open(&binary_file_path).map_err(|e| e.to_string())?;
    let mut binary_data = Vec::new();
    binary_file
        .read_to_end(&mut binary_data)
        .map_err(|e| e.to_string())?;

    let umpk80 = umpk_state.0.lock().unwrap();
    umpk80.load_program(&binary_data, binary_data.len() as u16, 0x0000);

    Ok((output_string, binary_data))
}