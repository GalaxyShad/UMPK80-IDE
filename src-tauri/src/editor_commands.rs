use std::fs::File;
use std::io::{Read, Write};

#[tauri::command]
pub fn save_source_code_to_file(file_path: &str, source_code: &str) -> Result<(), String> {
    let mut f = File::create(file_path).map_err(|err| err.to_string())?;
    f.write_all(source_code.as_bytes())
        .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn load_source_code_from_file(file_path: &str) -> Result<String, String> {
    let mut f = File::open(file_path).map_err(|err| err.to_string())?;

    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .map_err(|err| err.to_string())?;

    Ok(contents)
}