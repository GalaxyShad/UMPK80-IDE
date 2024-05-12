use std::ffi::CStr;
use libc::{c_void, size_t};

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

#[repr(C)]
struct CUMPK80InstructionT {
    mnemonic: *const libc::c_char,
    length: libc::c_int,
    operand: *const libc::c_char,
}

pub struct UMPK80Instruction {
    pub mnemonic: &'static str,
    pub length: i32,
    pub operand: &'static str
}

#[repr(C)]
struct CUMPK80_I8080DisassembleResult {
    address: u16,
    bytes_count: u8,
    bytes: [u8; 3],
    instruction: *const CUMPK80InstructionT,
    eof: bool,
}

pub struct I8080DisassembleResult {
    pub address: u16,
    pub bytes: Vec<u8>,
    pub instruction: Option<UMPK80Instruction>,
    pub eof: bool,
}

#[link(name = "cumpk80")]
extern "C" {
    fn UMPK80_Create() -> *mut libc::c_void;
    fn UMPK80_Free(umpk: *mut libc::c_void);

    fn UMPK80_PortIOSetInput(umpk: *mut libc::c_void, data: u8);
    fn UMPK80_PortIOGetInput(umpk: *mut libc::c_void) -> u8;

    fn UMPK80_PortIOGetOutput(umpk: *mut libc::c_void) -> u8;

    fn UMPK80_Tick(umpk: *mut libc::c_void);
    fn UMPK80_Stop(umpk: *mut libc::c_void);
    fn UMPK80_Restart(umpk: *mut libc::c_void);

    fn UMPK80_KeyboardPressButton(umpk: *mut libc::c_void, key: u8);
    fn UMPK80_KeyboardReleaseButton(umpk: *mut libc::c_void, key: u8);

    fn UMPK80_DisplayGetDigit(umpk: *mut libc::c_void, digit: libc::c_int) -> u8;
    fn UMPK80_LoadOS(umpk: *mut libc::c_void, os: *const u8);

    fn UMPK80_LoadProgram(
        umpk: *mut libc::c_void,
        program: *const u8,
        programSize: u16,
        dstAddress: u16,
    );

    fn UMPK80_CpuSetProgramCounter(umpk: *mut libc::c_void, value: u16);
    fn UMPK80_CpuProgramCounter(umpk: *mut libc::c_void) -> u16;
    fn UMPK80_CpuStackPointer(umpk: *mut libc::c_void) -> u16;
    fn UMPK80_CpuGetRegister(umpk: *mut libc::c_void, reg: Umpk80Register) -> u8;
    fn UMPK80_CpuSetRegister(umpk: *mut libc::c_void, reg: Umpk80Register, data: u8);
    fn UMPK80_CpuJump(umpk: *mut libc::c_void, adr: u16);
    fn UMPK80_CpuCall(umpk: *mut libc::c_void, adr: u16);

    fn UMPK80_GetRegister(umpk: *mut libc::c_void, reg: Umpk80Register) -> u8;
    fn UMPK80_SetRegister(umpk: *mut libc::c_void, reg: Umpk80Register, value: u8);

    fn UMPK80_GetRegisterPair(umpk: *mut libc::c_void, regPair: Umpk80RegisterPair) -> u16;
    fn UMPK80_SetRegisterPair(umpk: *mut libc::c_void, regPair: Umpk80RegisterPair, value: u16);

    fn UMPK80_MemoryRead(umpk: *mut libc::c_void, adr: u16) -> u8;
    fn UMPK80_MemoryWrite(umpk: *mut libc::c_void, adr: u16, data: u8);

    fn UMPK80_GetInstruction(code: u8) -> *const CUMPK80InstructionT;

    fn UMPK80_CreateI8080Disassembler(memory: *const u8, size: size_t) -> *mut libc::c_void;
    fn UMPK80_FreeI8080Disassembler(disasm: *mut libc::c_void);

    fn UMPK80_I8080DisassemblerDisassemble(disasm: *mut libc::c_void) -> CUMPK80_I8080DisassembleResult;
    fn UMPK80_I8080DisassemblerReset(disasm: *mut libc::c_void);
    fn UMPK80_I8080DisassemblerPG(disasm: *mut libc::c_void) -> u16;
}

pub fn umpk_get_instruction(code: u8) -> UMPK80Instruction {
    unsafe {
        let c_instr = UMPK80_GetInstruction(code);

        UMPK80Instruction {
            mnemonic: CStr::from_ptr((*c_instr).mnemonic).to_str().unwrap(),
            length: (*c_instr).length,
            operand: CStr::from_ptr((*c_instr).mnemonic).to_str().unwrap()
        }
    }
}

pub struct Umpk80 {
    ptr: *mut c_void,
    display_address: u16,
    speaker_volume: f32,
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
            Self { ptr: ptr, speaker_volume: 0.01, display_address: 0 }
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

    pub fn get_display_digit(&self, digit: i32) -> u8 {
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

    pub fn set_cpu_register(&self, register: Umpk80Register, data: u8) {
        unsafe { UMPK80_CpuSetRegister(self.ptr, register, data) }
    }

    pub fn cpu_jump_to(&self, address: u16) {
        unsafe { UMPK80_CpuJump(self.ptr, address) }
    }

    pub fn cpu_call(&self, address: u16) {
        unsafe { UMPK80_CpuCall(self.ptr, address) }
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

    pub fn set_speaker_volume(&mut self, volume: f32) {
        self.speaker_volume = volume;
    }

    pub fn get_speaker_volume(&self) -> f32 {
        self.speaker_volume
    }

    pub fn memory_read(&self, address: u16) -> u8 {
        unsafe { UMPK80_MemoryRead(self.ptr, address) }
    }

    pub fn memory_write(&self, address: u16, data: u8) {
        unsafe { UMPK80_MemoryWrite(self.ptr, address, data); }
    }

    pub fn get_display_address(&self) -> u16 { self.display_address }

    pub fn set_display_address(&mut self, adr: u16) { self.display_address = adr; }
}

unsafe impl Send for Umpk80 {}

pub struct Intel8080Disassembler(*mut c_void);

impl Intel8080Disassembler {
    pub fn new(memory: &[u8]) -> Self {
        Intel8080Disassembler( unsafe { UMPK80_CreateI8080Disassembler(memory.as_ptr(), memory.len()) } )
    }

    pub fn disassemble(&self) -> I8080DisassembleResult {
        let res = unsafe { UMPK80_I8080DisassemblerDisassemble(self.0) };

        let instruction: Option<UMPK80Instruction> = unsafe {
            match res.instruction.is_null() {
                true => Option::None,
                false => Option::Some(UMPK80Instruction {
                    mnemonic: CStr::from_ptr((*res.instruction).mnemonic).to_str().unwrap(),
                    length: (*res.instruction).length,
                    operand: CStr::from_ptr((*res.instruction).mnemonic).to_str().unwrap(),
                })
            }
        };

        let bytes_count = res.bytes_count as usize;

        I8080DisassembleResult {
            address: res.address,
            bytes: res.bytes[0..bytes_count].to_vec(),
            instruction,
            eof: res.eof,
        }
    }

    pub fn program_counter(&self) -> u16 { unsafe { UMPK80_I8080DisassemblerPG(self.0) } }

    pub fn reset(&self) { unsafe { UMPK80_I8080DisassemblerReset(self.0) } }
}

impl Drop for Intel8080Disassembler {
    fn drop(&mut self) { unsafe { UMPK80_FreeI8080Disassembler(self.0) } }
}


#[cfg(test)]
mod tests {
    use crate::umpk80_lib::{I8080DisassembleResult, Intel8080Disassembler, Umpk80, UMPK80_GetInstruction, UMPK80Instruction, Umpk80Register, umpk_get_instruction};

    static OS_FILE: &[u8] = include_bytes!("../../core/data/scaned-os-fixed.bin");

    #[test]
    fn umpk__load_os__first_byte_should_be_26h() {
        let umpk = Umpk80::new();

        umpk.load_os(OS_FILE);
        let m = umpk.get_register(Umpk80Register::M);

        assert_eq!(m, 0x26);
    }

    #[test]
    fn umpk__umpk_get_instruction__instruction_with_code_27h_should_be_daa() {
        let instr = umpk_get_instruction(0x27);

        assert_eq!(instr.mnemonic, "DAA");
    }

    #[test]
    fn disassembler__disassemble__first_byte_of_os_should_be_mvi_h() {
        let disassembler = Intel8080Disassembler::new(OS_FILE);

        let res = disassembler.disassemble();

        let instruction = res.instruction.unwrap();

        assert_eq!(instruction.mnemonic, "MVI H");
        assert_eq!(instruction.length, 2);
    }

    #[test]
    fn disassembler__disassemble__should_return_eof_in_end() {
        let memory: [u8; 1] = [0x00];

        let disassembler = Intel8080Disassembler::new(&memory);

        let nop = disassembler.disassemble();

        assert_eq!(nop.eof, false);

        let eof = disassembler.disassemble();

        assert_eq!(eof.eof, true);
    }
}