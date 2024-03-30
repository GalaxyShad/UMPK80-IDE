use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use std::time;
use tauri::Window;

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
        self.umpk80.lock().unwrap().tick();
    }
}

#[tauri::command]
fn start_umpk80(window: Window) {
    let app_state = Arc::new(AppState::new());

    let app_state_clone = app_state.clone();
    thread::spawn(move || loop {
        app_state_clone.tick();
    });

    let window = window.clone();

    let app_state = Arc::clone(&app_state);
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
        drop(umpk80);

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
