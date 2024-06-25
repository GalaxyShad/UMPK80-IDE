use std::{env};
use std::process::Command;
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

    let target_triple = env::var("TARGET").expect("TARGET environment variable not set");
    let rid = env::var("RID").unwrap_or_else(|_| "win-x64".to_string());

    let output = Command::new("dotnet")
        .arg("publish")
        .arg("../translator/SomeAsmTranslator/SomeAsmTranslator.csproj")
        .arg("--self-contained").arg("true")
        .arg("--runtime").arg(&rid)
        .arg("--output").arg("./bin")
        .arg("-p:PublishSingleFile=true")
        .arg("-p:UseAppHost=true")
        .arg(format!("-p:AssemblyName=i8080-{}", target_triple))
        .output()
        .expect("Check that .NET 8.0 installed");

    if !output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);

        println!("cargo::warning=SomeIntel8080ASMTranslator build fail. rid={}", rid);
        println!("cargo::warning={:?}", &stdout);
    }

    println!("cargo::rerun-if-changed=../core/src/");

    tauri_build::build()
}
