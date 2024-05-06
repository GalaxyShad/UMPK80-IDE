use rodio::source::SineWave;
use rodio::Source;
use rodio::{Decoder, OutputStream, Sink};
use serde::{Deserialize, Serialize};
use std::f32::consts::PI;
use std::fs::File;
use std::io::Read;
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use std::thread::JoinHandle;
use std::time;
use std::time::Duration;
use std::{array, vec};
use std::error::Error;
use tauri::Window;
use tauri::{command, State};
use tauri::{App, Manager};
use tempfile::{NamedTempFile, TempDir};
use umpk80::Umpk80Register;
use umpk80::Umpk80RegisterPair;

mod squarewave;
mod umpk80;

use squarewave::SquareWave;
use umpk80::Umpk80;
use crate::umpk80::Intel8080Disassembler;

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

    stack_start: u16,
    stack: Vec<u8>,
}

struct AppState {
    umpk80: Arc<Mutex<Umpk80>>,
    umpk_thread_handle: JoinHandle<()>,
    translator_path: Mutex<String>,
}

static OS_FILE: &[u8] = include_bytes!("../../core/data/scaned-os-fixed.bin");

impl AppState {
    fn new() -> Self {
        let umpk80 = Arc::new(Mutex::new(Umpk80::new()));

        umpk80.lock().unwrap().load_os(OS_FILE);

        let thread_umpk = Arc::clone(&umpk80);
        let umpk_thread_handle = thread::spawn(move || loop {
            let umpk = thread_umpk.lock().unwrap();
            umpk.tick();

            if umpk.get_cpu_program_counter() == 0x0447 {
                let frequency = (0xFF - umpk.get_cpu_register(umpk80::Umpk80Register::B)) as f32;
                let duration = umpk.get_cpu_register(umpk80::Umpk80Register::D) as u64;
                let volume = umpk.get_speaker_volume();

                play_tone((frequency) * 1.5, duration * 3, volume);
            }
        });

        Self {
            umpk80,
            umpk_thread_handle,
            translator_path: Mutex::new(String::from("i8080")),
        }
    }
}

fn play_tone(freq: f32, duration: u64, volume: f32) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    let source = SquareWave::new(freq)
        .take_duration(Duration::from_millis(duration))
        .amplify(volume);

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
fn umpk_set_speaker_volume(state: State<AppState>, volume: f32) {
    state.umpk80.lock().unwrap().set_speaker_volume(volume);
}

#[command]
fn umpk_get_rom(state: State<AppState>) -> Vec<u8> {
    let umpk80 = state.umpk80.lock().unwrap();

    return array::from_fn::<u8, 0x0800, _>(|x| umpk80.memory_read(x as u16)).to_vec();
}

#[tauri::command]
fn umpk_get_ram(state: State<AppState>) -> Vec<u8> {
    let umpk80 = state.umpk80.lock().unwrap();

    return array::from_fn::<u8, 0x0800, _>(|x| umpk80.memory_read(0x0800 + x as u16)).to_vec();
}

#[tauri::command]
fn umpk_set_register(state: State<AppState>, register_name: &str, data: u16) -> Result<(), String> {
    let umpk = state.umpk80.lock().unwrap();

    match register_name {
        "a" => umpk.set_register(Umpk80Register::A, data as u8),
        "psw" => umpk.set_register(Umpk80Register::PSW, data as u8),

        "b" => umpk.set_register(Umpk80Register::B, data as u8),
        "c" => umpk.set_register(Umpk80Register::C, data as u8),

        "d" => umpk.set_register(Umpk80Register::D, data as u8),
        "e" => umpk.set_register(Umpk80Register::E, data as u8),

        "h" => umpk.set_register(Umpk80Register::H, data as u8),
        "l" => umpk.set_register(Umpk80Register::L, data as u8),

        "pc" => umpk.set_register_pair(Umpk80RegisterPair::PC, data),
        "sp" => umpk.set_register_pair(Umpk80RegisterPair::SP, data),

        _ => return Err(format!("Unknown register name {register_name}").into()),
    };

    Ok(())
}

#[tauri::command]
fn umpk_get_state(state: State<AppState>) -> TypePayload {
    let umpk80 = state.umpk80.lock().unwrap();

    let display = array::from_fn(|x| umpk80.get_display_digit(x as i32));
    let pg = umpk80.get_cpu_program_counter();
    let io = umpk80.get_port_io_output();
    let registers = RegistersPayload {
        a: umpk80.get_register(Umpk80Register::A),
        b: umpk80.get_register(Umpk80Register::B),
        c: umpk80.get_register(Umpk80Register::C),
        d: umpk80.get_register(Umpk80Register::D),
        e: umpk80.get_register(Umpk80Register::E),
        h: umpk80.get_register(Umpk80Register::H),
        l: umpk80.get_register(Umpk80Register::L),
        m: umpk80.get_register(Umpk80Register::M),
        psw: umpk80.get_register(Umpk80Register::PSW),

        sp: umpk80.get_register_pair(Umpk80RegisterPair::SP),
        pc: umpk80.get_register_pair(Umpk80RegisterPair::PC),
    };
    let stack = array::from_fn::<u8, 0x0100, _>(|i| umpk80.memory_read(0x0BB0 - i as u16)).to_vec();

    TypePayload {
        digit: display,
        pg,
        io,
        registers,
        stack,
        stack_start: 0x0BB0,
    }
}

#[tauri::command]
fn save_source_code_to_file(file_path: &str, source_code: &str) -> Result<(), String> {
    let mut f = File::create(file_path).map_err(|err| err.to_string())?;
    f.write_all(source_code.as_bytes())
        .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn load_source_code_from_file(file_path: &str) -> Result<String, String> {
    let mut f = File::open(file_path).map_err(|err| err.to_string())?;

    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .map_err(|err| err.to_string())?;

    Ok(contents)
}

#[tauri::command]
fn translator_set_execution_command(
    state: State<AppState>,
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
fn process_string(
    state: State<AppState>,
    input_string: String,
) -> Result<(String, Vec<u8>), String> {
    let temp_dir = TempDir::new().map_err(|x| x.to_string())?;
    let source_file_path = Path::join(temp_dir.path(), "a.asm");

    let mut source_file = File::create(&source_file_path).map_err(|x| x.to_string())?;

    source_file.write_all(input_string.as_bytes()).map_err(|x| x.to_string())?;

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

    let umpk80 = state.umpk80.lock().unwrap();
    umpk80.load_program(&binary_data, binary_data.len() as u16, 0x0000);

    Ok((output_string, binary_data))
}

#[derive(Serialize, Deserialize)]
struct DisassembledLinePayload {
    address: u16,
    mnemonic: String,
    arguments: Vec<u8>,
    bytes: Vec<u8>
}

#[tauri::command]
fn umpk_get_disassembled_rom() -> Vec<DisassembledLinePayload> {
    let disassembler = Intel8080Disassembler::new(OS_FILE);

    (0..)
        .map(|_| disassembler.disassemble())
        .take_while(|res| !res.eof)
        .fold(Vec::new(), |mut acc, x| {
            acc.push(DisassembledLinePayload {
                address: x.address,
                mnemonic: x.instruction.unwrap().mnemonic.to_string(),
                arguments: match x.bytes.len() {
                    2 => x.bytes[1..].to_vec(),
                    3 => vec![x.bytes[2], x.bytes[1]],
                    _ => Vec::new(),
                },
                bytes: x.bytes,
            });

            acc
        })
}

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
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
            process_string,
            load_source_code_from_file,
            save_source_code_to_file,
            translator_set_execution_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
