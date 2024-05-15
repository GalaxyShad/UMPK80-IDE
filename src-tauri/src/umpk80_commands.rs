use std::{array, thread};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use tauri::{command, State};
use crate::{umpk80_lib};
use crate::tone::play_tone;
use crate::umpk80_lib::{Intel8080Disassembler, Umpk80, Umpk80Register, Umpk80RegisterPair};

static OS_FILE: &[u8] = include_bytes!("../../core/data/scaned-os-fixed.bin");

#[derive(Serialize, Deserialize, Clone)]
pub struct UmpkRegistersPayload {
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
pub struct UmpkStatePayload {
    display: [u8; 6],
    pg: u16,
    io: u8,
    registers: UmpkRegistersPayload,
    display_address: u16,

    stack_start: u16,
    stack: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub struct DisassembledLinePayload {
    pub address: u16,
    pub mnemonic: String,
    pub arguments: Vec<u8>,
    pub bytes: Vec<u8>,
    pub comment: String
}

pub struct Umpk80State(pub Arc<Mutex<Umpk80>>);

impl Umpk80State {
    pub fn new() -> Self {
        let umpk80 = Arc::new(Mutex::new(Umpk80::new()));

        umpk80.lock().unwrap().load_os(OS_FILE);

        let thread_umpk = Arc::clone(&umpk80);

        thread::spawn(move || loop {
            let mut umpk = thread_umpk.lock().unwrap();
            umpk.tick();

            if umpk.get_cpu_program_counter() == 0x0447 {
                let frequency = (0xFF - umpk.get_cpu_register(umpk80_lib::Umpk80Register::B)) as f32;
                let duration = umpk.get_cpu_register(umpk80_lib::Umpk80Register::D) as u64;
                let volume = umpk.get_speaker_volume();

                play_tone((frequency) * 1.5, duration * 3, volume);
            }

            let FETA3 = 0x0364;
            if umpk.get_cpu_program_counter() == FETA3 {
                let b = umpk.get_cpu_register(Umpk80Register::B);
                let c=umpk.get_cpu_register(Umpk80Register::C);
                let bc = ((b as u16) << 8) | c as u16;

                umpk.set_display_address(bc)
            }
        });

        Self(umpk80)
    }
}

#[tauri::command]
pub async fn umpk_get_state(state: State<'_, Umpk80State>) -> Result<UmpkStatePayload, ()> {
    let umpk80 = state.0.lock().unwrap();

    let display = array::from_fn(|x| umpk80.get_display_digit(x as i32));
    let pg = umpk80.get_cpu_program_counter();
    let io = umpk80.get_port_io_output();
    let registers = UmpkRegistersPayload {
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

    Ok(UmpkStatePayload {
        display,
        pg,
        io,
        registers,
        stack,
        display_address: umpk80.get_display_address(),
        stack_start: 0x0BB0,
    })
}

#[tauri::command]
pub async fn umpk_press_key(state: State<'_, Umpk80State>, key: u8) -> Result<(),()> {
    let umpk80 = state.0.lock().unwrap();
    umpk80.press_key(key);
    Ok(())
}

#[tauri::command]
pub async fn umpk_release_key(state: State<'_, Umpk80State>, key: u8) -> Result<(),()> {
    let umpk80 = state.0.lock().unwrap();
    umpk80.release_key(key);
    Ok(())
}

#[tauri::command]
pub async fn umpk_set_io_input(state: State<'_, Umpk80State>, io: u8) -> Result<(),()> {
    let umpk80 = state.0.lock().unwrap();
    umpk80.set_port_io_input(io);
    Ok(())
}

#[tauri::command]
pub async fn umpk_set_speaker_volume(state: State<'_, Umpk80State>, volume: f32) -> Result<(),()> {
    state.0.lock().unwrap().set_speaker_volume(volume);
    Ok(())
}

#[command]
pub async fn umpk_get_rom(state: State<'_, Umpk80State>) -> Result<Vec<u8>, ()> {
    let umpk80 = state.0.lock().unwrap();

    return Ok(array::from_fn::<u8, 0x0800, _>(|x| umpk80.memory_read(x as u16)).to_vec());
}

#[tauri::command]
pub async fn umpk_get_ram(state: State<'_, Umpk80State>) -> Result<Vec<u8>, ()> {
    let umpk80 = state.0.lock().unwrap();

    return Ok(array::from_fn::<u8, 0x0800, _>(|x| umpk80.memory_read(0x0800 + x as u16)).to_vec());
}

#[tauri::command]
pub async fn umpk_write_to_memory(state: State<'_, Umpk80State>, address: u16, data: u8 ) -> Result<(),()> {
    state.0.lock().unwrap().memory_write(address, data);
    Ok(())
}

#[tauri::command]
pub async fn umpk_set_register(state: State<'_, Umpk80State>, register_name: &str, data: u16) -> Result<(), String> {
    let umpk = state.0.lock().unwrap();

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
pub async fn umpk_get_disassembled_rom() -> Vec<DisassembledLinePayload> {
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
                comment: "".to_string()
            });

            acc
        })
}