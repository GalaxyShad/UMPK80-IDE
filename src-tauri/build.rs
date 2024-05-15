use std::env;
use cc::Build;

fn main() {
    env::set_var("CC_ENABLE_DEBUG_OUTPUT", "1");
    env::set_var("VSLANG", "1033");
    env::set_var("RUST_LOG", "debug");

    Build::new()
        .cpp(true)
        .flag("-std=c++11")
        .include("../core/src")
        .file("../core/src/core/cpu.cpp")
        .file("../core/src/core/cpu.instructions.cpp")
        .file("../core/src/cumpk80.cpp")
        .compile("cumpk80");

    println!("cargo::rerun-if-changed=../core/src/");

    tauri_build::build()
}
