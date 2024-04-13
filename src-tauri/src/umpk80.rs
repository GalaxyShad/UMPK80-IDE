use libc::c_void;
use std::os::raw::c_int;

#[repr(C)]
pub enum Umpk80Register {
    PcLow,
    PcHigh,
    SpLow,
    SpHigh,
    L,
    H,
    E,
    D,
    C,
    B,
    PSW,
    A,
    M,
}

#[repr(C)]
pub enum Umpk80RegisterPair {
    PC,
    SP,
    HL,
    DE,
    BC,
    PSWA,
}

#[link(name = "cumpk80")]
extern "C" {
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

    pub fn UMPK80_LoadProgram(
        umpk: *mut libc::c_void,
        program: *const u8,
        programSize: u16,
        dstAddress: u16,
    );

    pub fn UMPK80_CpuSetProgramCounter(umpk: *mut libc::c_void, value: u16);
    pub fn UMPK80_CpuProgramCounter(umpk: *mut libc::c_void) -> u16;
    pub fn UMPK80_CpuStackPointer(umpk: *mut libc::c_void) -> u16;
    pub fn UMPK80_CpuGetRegister(umpk: *mut libc::c_void, reg: Umpk80Register) -> u8;

    pub fn UMPK80_GetRegister(umpk: *mut libc::c_void, reg: Umpk80Register) -> u8;
    pub fn UMPK80_SetRegister(umpk: *mut libc::c_void, reg: Umpk80Register, value: u8);

    pub fn UMPK80_GetRegisterPair(umpk: *mut libc::c_void, regPair: Umpk80RegisterPair) -> u16;
    pub fn UMPK80_SetRegisterPair(umpk: *mut libc::c_void, regPair: Umpk80RegisterPair, value: u16);
}

pub struct Umpk80 {
    ptr: *mut c_void,
}

impl Drop for Umpk80 {
    fn drop(&mut self) {
        unsafe {
            UMPK80_Free(self.ptr);
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
            Self { ptr }
        }
    }

    pub fn set_port_io_input(&self, data: u8) {
        unsafe {
            UMPK80_PortIOSetInput(self.ptr, data);
        }
    }

    pub fn get_port_io_input(&self) -> u8 {
        unsafe { UMPK80_PortIOGetInput(self.ptr) }
    }

    pub fn get_port_io_output(&self) -> u8 {
        unsafe { UMPK80_PortIOGetOutput(self.ptr) }
    }

    pub fn tick(&self) {
        unsafe {
            UMPK80_Tick(self.ptr);
        }
    }

    pub fn stop(&self) {
        unsafe {
            UMPK80_Stop(self.ptr);
        }
    }

    pub fn restart(&self) {
        unsafe {
            UMPK80_Restart(self.ptr);
        }
    }

    pub fn press_key(&self, key: u8) {
        unsafe {
            UMPK80_KeyboardPressButton(self.ptr, key);
        }
    }

    pub fn release_key(&self, key: u8) {
        unsafe {
            UMPK80_KeyboardReleaseButton(self.ptr, key);
        }
    }

    pub fn get_display_digit(&self, digit: c_int) -> u8 {
        unsafe { UMPK80_DisplayGetDigit(self.ptr, digit) }
    }

    pub fn load_os(&self, os: &[u8]) {
        unsafe {
            UMPK80_LoadOS(self.ptr, os.as_ptr());
        }
    }

    pub fn set_cpu_program_counter(&self, data: u16) {
        unsafe { UMPK80_CpuSetProgramCounter(self.ptr, data) }
    }

    pub fn get_cpu_program_counter(&self) -> u16 {
        unsafe { UMPK80_CpuProgramCounter(self.ptr) }
    }

    pub fn get_cpu_stack_pointer(&self) -> u16 {
        unsafe { UMPK80_CpuStackPointer(self.ptr) }
    }

    
    pub fn load_program(&self, program: &[u8], program_size: u16, dst_address: u16) {
        unsafe {
            UMPK80_LoadProgram(self.ptr, program.as_ptr(), program_size, dst_address);
        }
    }
    
    pub fn get_cpu_register(&self, register: Umpk80Register) -> u8 {
        unsafe { UMPK80_CpuGetRegister(self.ptr, register) }
    }

    pub fn get_register(&self, register: Umpk80Register) -> u8 {
        unsafe { UMPK80_GetRegister(self.ptr, register) }
    }

    pub fn set_register(&self, register: Umpk80Register, data: u8) {
        unsafe { UMPK80_SetRegister(self.ptr, register, data) }
    }

    pub fn get_register_pair(&self, register_pair: Umpk80RegisterPair) -> u16 {
        unsafe { UMPK80_GetRegisterPair(self.ptr, register_pair) }
    }

    pub fn set_register_pair(&self, register_pair: Umpk80RegisterPair, data: u16) {
        unsafe { UMPK80_SetRegisterPair(self.ptr, register_pair, data) }
    }


}

unsafe impl Send for Umpk80 {}
