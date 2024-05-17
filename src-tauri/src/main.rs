use rodio::Source;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::io::Read;
use std::io::{BufRead, BufReader, Write};
use std::vec;
use tauri::Manager;

mod editor_commands;
mod squarewave;
mod tone;
mod translator_commands;
mod translator_lib;
mod translator_service;
mod umpk80_commands;
mod umpk80_lib;

use crate::editor_commands::{editor_load_source_code_from_file, editor_save_source_code_to_file};
use crate::translator_commands::{
    translator_build, translator_export_to, translator_get_monitor_system, translator_version,
};
use crate::umpk80_commands::{
    umpk_get_disassembled_rom, umpk_get_ram, umpk_get_rom, umpk_get_stack, umpk_get_state,
    umpk_press_key, umpk_release_key, umpk_run_from, umpk_set_io_input, umpk_set_register,
    umpk_set_speaker_volume, umpk_write_to_memory, Umpk80State,
};

fn main() {
    tauri::Builder::default()
        .manage(Umpk80State::new())
        .invoke_handler(tauri::generate_handler![
            umpk_press_key,
            umpk_release_key,
            umpk_set_io_input,
            umpk_set_register,
            umpk_set_speaker_volume,
            umpk_get_rom,
            umpk_get_ram,
            umpk_get_state,
            umpk_get_disassembled_rom,
            umpk_write_to_memory,
            umpk_run_from,
            umpk_get_stack,
            translator_version,
            translator_build,
            translator_get_monitor_system,
            translator_export_to,
            editor_load_source_code_from_file,
            editor_save_source_code_to_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
