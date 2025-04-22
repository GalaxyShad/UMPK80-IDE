<h1 align="center"> UMPK-80-IDE </h1>
<p align="center">
  <img src="https://github.com/user-attachments/assets/48490065-4c16-4a3c-9cda-2f6ea83cc2dc" alt="UMPK-80-IDE-LOGO" width="10%" height="auto">
</p>
<p align="center" markdown=1>
  <i>An integrated development environment designed for programming and software development on the USSR UMPK-80 computer, which is based on the KR580VM80 / INTEL8080 processor. Built using Tauri with Rust and TypeScript, this IDE includes an emulator and translator, making it an all-in-one application.</i>
</p>



<img width="1392" alt="image" src="https://github.com/GalaxyShad/UMPK80-IDE/assets/52833080/e269e14f-8a01-40da-9ce1-002f4f44108a">


## Motivation

During our university studies, we were taught the architecture of computer systems using the KR580VM80A microprocessor, an INTEL 8080 analog, on UMPK-80 workstations. This experience was both fascinating and challenging. The workstations were outdated and often malfunctioned, resulting in the resetting and loss of programs painstakingly translated from assembler to machine code. In addition, program debugging was only possible in the lab, requiring a constant physical presence.

These problems inspired me to create my own integrated development environment (IDE) that would solve these problems and provide additional features such as generating complex reports in various formats. In addition, I had wanted to try Rust and Tauri for a long time. It seems to me that using web technologies to interface Desktop applications is the best solution, given the wide community support, the huge set of tools and the ease of development provided by HTML and CSS for layout and design.

The UMPK-80 IDE is designed to provide a user-friendly and efficient development environment that allows users to write, translate, and debug programs without the limitations of legacy hardware. By integrating modern technologies, this environment not only solves practical issues that arise in a university lab, but also improves the overall level of development.

## What is UMPK-80?

The [UMPK-80/VM](https://retro-computer.ru/home.aspx#/item/UMPK_80) is a laboratory workbench developed in the USSR in 1987 at the Moscow Institute of Electronic Technology (MIET). It is designed for studying programming and the operation of the MP BIS KR580VM80A (the Soviet equivalent of the INTEL 8080), building microprocessor systems, and using as a controlling device when researching the operation of interface modules.

### Features

The UMPK-80 IDE is packed with a comprehensive set of features designed to enhance the development experience for the USSR UMPK-80 computer. Here are the key features:

- **Monaco Editor (VSCode Code Editor) with ASM Syntax Highlighting**:
  The IDE integrates the [Monaco Editor](https://github.com/microsoft/monaco-editor), the same editor used in Visual Studio Code, providing advanced syntax highlighting for assembly language. This ensures a smooth and efficient coding experience.

- **All Features of UMPK-80-Core**:
  The IDE includes all the functionalities of the [UMPK80-Core](https://github.com/GalaxyShad/UMPK-80-Emulator), offering a robust foundation for programming and software development on the KR580VM80A / INTEL8080 processor.

- **Integrated Translator - Some-I8080-ASM-Translator**:
  The IDE comes with an integrated translator, [Some-i8080-ASM-Translator](https://github.com/GalaxyShad/Some-i8080-ASM-Translator), which allows for seamless translation of assembly code to machine code. This feature significantly reduces the time and effort required for manual translation.

- **Customizable Interface**:
  The user interface of the IDE is highly customizable (thanks to [FlexLayout](https://github.com/caplin/FlexLayout)), allowing developers to tailor the environment to their specific needs and preferences. This flexibility ensures a more productive and enjoyable development experience.

- **Integrated Documentation**:
  The IDE includes comprehensive documentation, providing developers with easy access to essential information and resources. This helps in understanding the system and its functionalities better.

- **Debug Editing**:
  The IDE offers robust debugging capabilities, enabling developers to identify and fix issues in their code efficiently. This feature is crucial for ensuring the reliability and performance of the software.

- **Light and Dark Theme**:
  The IDE supports both light and dark themes, allowing developers to choose the visual style that best suits their preferences and working environment. This feature helps in reducing eye strain and enhancing focus.

- **Direct RAM Editing**:
  The IDE provides the ability to directly edit the RAM, giving developers full control over the memory management of their programs. This feature is essential for low-level programming and debugging.

- **Listing Generation to docx, csv, md, txt**:
  The IDE can generate listings in various formats, including docx, csv, md, and txt. This feature is invaluable for documentation, reporting, and sharing code with others. It ensures that the code and its documentation are well-organized and easily accessible.

## Download
You can download the latest executable version of this project in the [Releases section](https://github.com/GalaxyShad/UMPK80-IDE/releases).

### Tech Stack
- GitModules
- React
- Zustand
- Tauri
- Rust
- Monaco Editor
- Vite
- Xterm.js
- Shadecn
- TypeScript

## Related Projects

- [Some-i8080-ASM-Translator](https://github.com/GalaxyShad/Some-i8080-ASM-Translator) - A modern and fast INTEL 8080 / KR580VM80A assembler translator created from scratch on .NET 8.0 and C#.
- [UMPK80-Core](https://github.com/GalaxyShad/UMPK-80-Emulator) - CORE of emulation.
- [ASM-I8080A-Programs-Collection](https://github.com/GalaxyShad/ASM-I8080A-Programs-Collection) - Examples of programs written for the UMPK-80.
- [UMPK80-Monitor-System](https://github.com/GalaxyShad/UMPK80-Monitor-System) - The source code of the DM80 firmware with comments.

## Good Information Sources

- [INTEL 8080 Assembly Programming Manual](https://altairclone.com/downloads/manuals/8080%20Programmers%20Manual.pdf) - The official manual for programming on the Intel 8080.
- [ALTAIR 8800 INSTRUCTION SET](https://ubuntourist.codeberg.page/Altair-8800/part-4.html) - A well-structured documentation of the Intel 8080 instructions.
- [INTEL 8080 instruction set table](https://pastraiser.com/cpu/i8080/i8080_opcodes.html) - A well-formatted table of the Intel 8080 opcodes.
- [Workbench Photos](https://retro-computer.ru/home.aspx#/item/UMPK_80) - A gallery of workbench photos from the museum.
- Book: "Microcomputers. Book 7. Training Stands. Practical Manual." Edited by L.N. Presnukhin. Authors: Yu.I. Volkov, V.L. Gorbunov, D.I. Panfilov, S.G. Shar

### Supported platforms
The UMPK-80 IDE is designed to run on the following platforms:

- Windows (x64✔, x86, ARM64)
- macOS (x64, ARM64✔)
- Linux (x64, ARM64)

✔ - Indicates platforms that have been tested.

### How to build
The UMPK-80 IDE leverages the UMPK-80-Core and Some-Intel8080-ASM-Translator components to provide a comprehensive development environment. The UMPK-80-Core API is built from C++ source code using Foreign Function Interface (FFI), while the Some-Intel8080-ASM-Translator is used for translating assembly code to machine code.

Before proceeding with the build, ensure that you have [.NET 8.0 installed](https://dotnet.microsoft.com/en-us/download/dotnet), as it is required for building the translator.

Clone the Repository with Recursive Submodules

Ensure you clone the repository with all its submodules to include the necessary dependencies:

```
git clone --recurse-submodules https://github.com/GalaxyShad/UMPK80-IDE.git
cd UMPK80-IDE
```
Build the Project

Navigate to the src-tauri directory and use Cargo to build the project:
```
cd src-tauri
cargo tauri build
```

### Demo
![umpk-80-ide](https://github.com/user-attachments/assets/4b25ee70-6fd6-4404-aa9e-534bca25c7f0)

#### TODO
- [ ] set address on click in program tab
- [ ] editor code preview
- [ ] save editor settings
- [ ] translator setup instruction
- [ ] decompile from RAM
- [ ] tooltips for data
- [ ] toolbar hotkeys
- [ ] read programs from binary
- [ ] disassemble from binary
- [ ] refresh screen if register changed
