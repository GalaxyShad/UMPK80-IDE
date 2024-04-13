use rodio::source::SineWave;
use rodio::Source;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use std::time;
use std::time::Duration;
use tauri::State;
use tauri::Window;
use std::io::{Write, BufRead, BufReader};
use std::process::Command;
use tempfile::NamedTempFile;
use rodio::{Decoder, OutputStream, Sink};
use std::f32::consts::PI;

mod squarewave;
mod umpk80;

use umpk80::Umpk80;
use squarewave::SquareWave;

#[derive(Serialize, Deserialize, Clone)]
struct RegistersPayload {
    a: u8,
    m: u8,
    b: u8,
    c: u8,
    d: u8,
    e: u8,
    h: u8,
    l: u8,
    psw: u8,
    pc: u16,
    sp: u16,
}

#[derive(Serialize, Deserialize, Clone)]
struct TypePayload {
    digit: [u8; 6],
    pg: u16,
    io: u8,
    registers: RegistersPayload,
}

struct AppState {
    umpk80: Arc<Mutex<Umpk80>>,
}

impl AppState {
    fn new() -> Self {
        let umpk80 = Arc::new(Mutex::new(Umpk80::new()));

        let mut file = File::open("../core/data/scaned-os-fixed.bin").expect("Failed to open file");

        let mut contents = Vec::new();
        file.read_to_end(&mut contents)
            .expect("Failed to read file");

        umpk80.lock().unwrap().load_os(contents.as_mut_slice());

        Self { umpk80 }
    }

    fn tick(&self) {
        self.umpk80.lock().unwrap().tick();
    }
}


fn play_tone(freq: f32, duration: u64) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    let source = SquareWave::new(freq).take_duration(Duration::from_millis(duration)).amplify(0.01);

    sink.append(source);
    sink.sleep_until_end();
}

#[tauri::command]
fn umpk_press_key(state: State<AppState>, key: u8) {
    let umpk80 = state.umpk80.lock().unwrap();
    umpk80.press_key(key);
}

#[tauri::command]
fn umpk_release_key(state: State<AppState>, key: u8) {
    let umpk80 = state.umpk80.lock().unwrap();
    umpk80.release_key(key);
}

#[tauri::command]
fn umpk_set_io_input(state: State<AppState>, io: u8) {
    let umpk80 = state.umpk80.lock().unwrap();
    umpk80.set_port_io_input(io);
}

#[tauri::command]
fn process_string(state: State<AppState>, input_string: String) -> Result<(String, Vec<u8>), String> {
    let mut temp_file = NamedTempFile::new().map_err(|err| err.to_string())?;

    temp_file.write_all(input_string.as_bytes()).map_err(|err| err.to_string());

    temp_file.flush().map_err(|err| err.to_string());

    let mut command = Command::new("i8080");

    let path = temp_file.into_temp_path().keep().map_err(|err| err.to_string())?;

    let output = command.arg(path.clone()).arg("-b").output().map_err(|err| err.to_string())?;

    if !output.status.success() {
        return Err("Command execution failed".to_string());
    }

    let mut output_string = String::new();
    BufReader::new(&output.stdout[..]).read_to_string(&mut output_string);

    let path_parent = path.parent().unwrap();

    let binary_file_path = {
        let mut path = PathBuf::from(path_parent);
        path.push(format!("{}\\.i8080asm.bin", path_parent.to_str().unwrap()));
        path
    };
    
    println!("{}", binary_file_path.display());
    
    let mut binary_file = File::open(&binary_file_path).map_err(|e| e.to_string())?;
    let mut binary_data = Vec::new();
    binary_file.read_to_end(&mut binary_data).map_err(|e| e.to_string())?;
    
    let umpk80 = state.umpk80.lock().unwrap();
    umpk80.load_program(&binary_data, binary_data.len() as u16, 0x0000);

    Ok((output_string, binary_data))
}

#[tauri::command]
fn start_umpk80(state: State<AppState>, window: Window) {
    let umpk80 = Arc::clone(&state.umpk80);

    thread::spawn(move || loop {
        let umpk = umpk80.lock().unwrap();
        umpk.tick();

        if umpk.get_cpu_program_counter() == 0x0447 {
            let frequency = (0xFF - umpk.get_cpu_register(umpk80::Umpk80Register::B)) as f32;
            let duration = umpk.get_cpu_register(umpk80::Umpk80Register::D) as u64;

            play_tone((frequency) * 1.5, duration * 3);
        }
    });

    let window = window.clone();

    let umpk80 = Arc::clone(&state.umpk80);
    thread::spawn(move || loop {
        let umpk80 = umpk80.lock().unwrap();

        let display = [
            umpk80.get_display_digit(0),
            umpk80.get_display_digit(1),
            umpk80.get_display_digit(2),
            umpk80.get_display_digit(3),
            umpk80.get_display_digit(4),
            umpk80.get_display_digit(5),
        ];
        let pg = umpk80.get_cpu_program_counter();
        let io = umpk80.get_port_io_output();
        let registers = RegistersPayload {
            a: umpk80.get_register(umpk80::Umpk80Register::A),
            b: umpk80.get_register(umpk80::Umpk80Register::B),
            c: umpk80.get_register(umpk80::Umpk80Register::C),
            d: umpk80.get_register(umpk80::Umpk80Register::D),
            e: umpk80.get_register(umpk80::Umpk80Register::E),
            h: umpk80.get_register(umpk80::Umpk80Register::H),
            l: umpk80.get_register(umpk80::Umpk80Register::L),
            m: umpk80.get_register(umpk80::Umpk80Register::M),
            psw: umpk80.get_register(umpk80::Umpk80Register::PSW),

            sp: umpk80.get_register_pair(umpk80::Umpk80RegisterPair::SP),
            pc: umpk80.get_register_pair(umpk80::Umpk80RegisterPair::PC),
        };
        drop(umpk80);

        let payload = TypePayload { digit: display, pg, io, registers };
        if let Err(e) = window.emit("PROGRESS", payload) {
            eprintln!("Error sending message: {}", e);
            break;
        }

        let delay = time::Duration::from_millis(1);
        thread::sleep(delay);
    });
}

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            start_umpk80,
            umpk_press_key,
            umpk_release_key,
            umpk_set_io_input,
            process_string
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
