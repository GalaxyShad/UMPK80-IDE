use rodio::Source;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::io::Read;
use std::io::{BufRead, BufReader, Write};
use std::{vec};
use tauri::{Manager};

mod squarewave;
mod umpk80_lib;
mod umpk80_commands;
mod tone;
mod editor_commands;
mod translator_commands;

use crate::editor_commands::{load_source_code_from_file, save_source_code_to_file};
use crate::translator_commands::{process_string, translator_set_execution_command, TranslatorState};
use crate::umpk80_commands::{Umpk80State, umpk_get_disassembled_rom, umpk_get_ram, umpk_get_rom, umpk_get_state, umpk_press_key, umpk_release_key, umpk_set_io_input, umpk_set_register, umpk_set_speaker_volume, umpk_write_to_memory};

fn main() {
    tauri::Builder::default()
        .manage(TranslatorState::new())
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
            process_string,
            load_source_code_from_file,
            save_source_code_to_file,
            translator_set_execution_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
