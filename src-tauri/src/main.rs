use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use std::sync::mpsc::channel;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use tauri::{Manager, Window as TauriWindow, WindowUrl};
use std::{time};

mod umpk80;
use umpk80::Umpk80;

#[derive(Serialize, Deserialize, Clone)]
struct TypePayload {
    digit: [u8; 6],
    pg: u16,
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
    let mut umpk80 = self.umpk80.lock().unwrap();
    umpk80.tick();
    let display = [
        umpk80.get_display_digit(0),
        umpk80.get_display_digit(1),
        umpk80.get_display_digit(2),
        umpk80.get_display_digit(3),
        umpk80.get_display_digit(4),
        umpk80.get_display_digit(5),
    ];
    let pg = umpk80.get_cpu_program_counter();
    println!(
        "{} {} {} {} {} {} {}",
        display[0], display[1], display[2], display[3], display[4], display[5], pg
    );
}
}

#[tauri::command]
fn start_umpk80(window: TauriWindow) {
    let app_state = Arc::new(AppState::new());

    let app_state_clone = app_state.clone();
    thread::spawn(move || loop {
        app_state_clone.tick();
    });

    let window = window.clone();
    thread::spawn(move || loop {
        let umpk80 = app_state.umpk80.lock().unwrap();
        let display = [
            umpk80.get_display_digit(0),
            umpk80.get_display_digit(1),
            umpk80.get_display_digit(2),
            umpk80.get_display_digit(3),
            umpk80.get_display_digit(4),
            umpk80.get_display_digit(5),
        ];
        let pg = umpk80.get_cpu_program_counter();
        let payload = TypePayload { digit: display, pg };
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
        .invoke_handler(tauri::generate_handler![start_umpk80])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
