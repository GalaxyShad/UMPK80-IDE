use std::os::raw::c_int;
use std::ptr;
use std::sync::{Arc, Mutex};

use libc::c_void;

#[link(name = "cumpk80")]
extern {
    pub fn UMPK80_Create() -> *mut libc::c_void;
    pub fn UMPK80_Free(umpk: *mut libc::c_void);

    pub fn UMPK80_PortIOSetInput(umpk: *mut libc::c_void, data: u8);
    pub fn UMPK80_PortIOGetInput(umpk: *mut libc::c_void) -> u8;

    pub fn UMPK80_PortIOGetOutput(umpk: *mut libc::c_void) -> u8;

    pub fn UMPK80_Tick(umpk: *mut libc::c_void);
    pub fn UMPK80_Stop(umpk: *mut libc::c_void);
    pub fn UMPK80_Restart(umpk: *mut libc::c_void);

    pub fn UMPK80_KeyboardPressButton(umpk: *mut libc::c_void, key: u8);
    pub fn UMPK80_KeyboardReleaseButton(umpk: *mut libc::c_void, key: u8);

    pub fn UMPK80_DisplayGetDigit(umpk: *mut libc::c_void, digit: libc::c_int) -> u8;
    pub fn UMPK80_LoadOS(umpk: *mut libc::c_void, os: *const u8);

    pub fn UMPK80_CpuProgramCounter(umpk: *mut libc::c_void) -> u16;
    pub fn UMPK80_CpuStackPointer(umpk: *mut libc::c_void) -> u16;
}

pub struct Umpk80 {
    ptr: Arc<Mutex<*mut c_void>>,
}

impl Drop for Umpk80 {
    fn drop(&mut self) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_Free(*ptr);
        }
    }
}

impl Umpk80 {
    pub fn new() -> Self {
        unsafe {
            let ptr = UMPK80_Create();
            if ptr.is_null() {
                panic!("Failed to create UMPK80 instance");
            }
            Self { ptr: Arc::new(Mutex::new(ptr)) }
        }
    }

    pub fn set_port_io_input(&self, data: u8) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_PortIOSetInput(*ptr, data);
        }
    }

    pub fn get_port_io_input(&self) -> u8 {
        let ptr = self.ptr.lock().unwrap();
        unsafe { UMPK80_PortIOGetInput(*ptr) }
    }

    pub fn get_port_io_output(&self) -> u8 {
        let ptr = self.ptr.lock().unwrap();
        unsafe { UMPK80_PortIOGetOutput(*ptr) }
    }

    pub fn tick(&self) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_Tick(*ptr);
        }
    }

    pub fn stop(&self) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_Stop(*ptr);
        }
    }

    pub fn restart(&self) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_Restart(*ptr);
        }
    }

    pub fn press_key(&self, key: u8) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_KeyboardPressButton(*ptr, key);
        }
    }

    pub fn release_key(&self, key: u8) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_KeyboardReleaseButton(*ptr, key);
        }
    }

    pub fn get_display_digit(&self, digit: c_int) -> u8 {
        let ptr = self.ptr.lock().unwrap();
        unsafe { UMPK80_DisplayGetDigit(*ptr, digit) }
    }

    pub fn load_os(&self, os: &[u8]) {
        let ptr = self.ptr.lock().unwrap();
        unsafe {
            UMPK80_LoadOS(*ptr, os.as_ptr());
        }
    }

    pub fn get_cpu_program_counter(&self) -> u16 {
        let ptr = self.ptr.lock().unwrap();
        unsafe { UMPK80_CpuProgramCounter(*ptr) }
    }

    pub fn get_cpu_stack_pointer(&self) -> u16 {
        let ptr = self.ptr.lock().unwrap();
        unsafe { UMPK80_CpuStackPointer(*ptr) }
    }
}

unsafe impl Send for Umpk80 {}