#![windows_subsystem = "windows"]

use rodio::Source;

use std::{fs, vec};
use tauri::{Manager, State, WindowEvent};

mod editor_commands;
mod squarewave;
mod tone;
mod translator_commands;
mod translator_lib;
mod translator_service;
mod umpk80_commands;
mod umpk80_lib;

use crate::editor_commands::{editor_load_source_code_from_file, editor_save_source_code_to_file};
use crate::translator_commands::{TempDirState, translator_build, translator_export_to, translator_get_default_path, translator_get_monitor_system, translator_version};
use crate::umpk80_commands::{
    umpk_get_disassembled_rom, umpk_get_ram, umpk_get_rom, umpk_get_stack, umpk_get_state,
    umpk_get_volume, umpk_press_key, umpk_release_key, umpk_run_from, umpk_set_io_input,
    umpk_set_register, umpk_set_speaker_volume, umpk_set_volume, umpk_write_to_memory, Umpk80State,
};

fn main() {
    tauri::Builder::default()
        .enable_macos_default_menu(false)
        .on_window_event(move |event| match event.event() {
            WindowEvent::Destroyed => {
                let mut am: State<TempDirState> = event.window().state();

                let path = {
                    let state = am.0.lock().unwrap();
                    state.path().to_owned()
                };

                fs::remove_dir_all(path).unwrap();
            }
            _ => { }
        })
        .manage(TempDirState::new())
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
            umpk_get_volume,
            umpk_set_volume,
            translator_version,
            translator_build,
            translator_get_monitor_system,
            translator_export_to,
            translator_get_default_path,
            editor_load_source_code_from_file,
            editor_save_source_code_to_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}