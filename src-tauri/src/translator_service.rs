use serde::{Deserialize, Serialize};
use std::fmt::format;
use std::{env, fmt, fmt::{Debug, Formatter}, fs, fs::File, io::BufRead, io::BufReader, io::Error, io::Read, io::Write, path::{Path, PathBuf}, process::Command, process::Output, thread, time};
use tempfile::TempDir;

use crate::translator_lib::SomeIntel8080Translator;

#[derive(Serialize, Deserialize)]
pub struct AssemblyListingLine {
    pub address: Option<u16>,
    pub bytes: Vec<u8>,
    pub label: String,
    pub assembly_code: String,
    pub comment: String,
}

pub enum TryTranslateErrorType {
    SourceCodeCreateTempFile,
    ExecutableRun,
    BinaryFileOpen,
}

pub struct TryTranslateError {
    pub kind: TryTranslateErrorType,
    pub inner: Error,
}

impl fmt::Display for TryTranslateError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.inner)
    }
}

impl Debug for TryTranslateError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.inner)
    }
}

fn make_temp_assembly_source_code_file(
    source_code: &str,
) -> Result<(TempDir, File, PathBuf), Error> {
    let temp_dir = TempDir::new()?;

    let source_file_path = Path::join(temp_dir.path(), "a.asm");

    let mut source_file = File::create(&source_file_path)?;
    source_file.write_all(source_code.as_bytes())?;

    Ok((temp_dir, source_file, source_file_path))
}

pub struct TranslateAssemblyToBinaryResult {
    pub output: Output,
    pub binary_data: Vec<u8>,
    pub listing_data: Vec<AssemblyListingLine>,
}

pub fn translate_assembly_to_binary(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<TranslateAssemblyToBinaryResult, TryTranslateError> {
    let (_temp_dir, _temp_src_file, temp_src_file_path) =
        make_temp_assembly_source_code_file(source_code).map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::SourceCodeCreateTempFile,
            inner: err,
        })?;

    let translate_output = SomeIntel8080Translator::new(translator_exe_path)
        .source_code_path(&temp_src_file_path)
        .binary()
        .same_line_bytes()
        .execute()
        .map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::ExecutableRun,
            inner: err,
        })?;

    let binary_file_path = temp_src_file_path.with_extension("i8080asm.bin");

    let mut binary_data = Vec::new();

    if binary_file_path.is_file() {
        let mut binary_file = File::open(&binary_file_path).map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::BinaryFileOpen,
            inner: err,
        })?;
        binary_file
            .read_to_end(&mut binary_data)
            .map_err(|err| TryTranslateError {
                kind: TryTranslateErrorType::BinaryFileOpen,
                inner: err,
            })?;
    }

    let mut listing_data = Vec::new();
    if binary_file_path.is_file() {
        let output_str = String::from_utf8(translate_output.stdout.clone()).unwrap();

        listing_data = output_str
            .split("\n")
            .skip(1)
            .take_while(|x| *x != "Success" && *x != "")
            .map(|x| parse_assembly_line(&x))
            .collect();
    }

    Ok(TranslateAssemblyToBinaryResult {
        output: translate_output,
        binary_data,
        listing_data,
    })
}

#[derive(Debug)]
enum TranslateFileType {
    Csv,
    Docx,
    Md,
    Txt,
}

impl fmt::Display for TranslateFileType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub fn translate_to_file_and_open(
    source_code: &str,
    translator_exe_path: &Path,
    file_type: TranslateFileType,
) -> Result<(), TryTranslateError> {
    let (temp_dir, temp_src_file, temp_src_file_path) =
        make_temp_assembly_source_code_file(source_code).map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::SourceCodeCreateTempFile,
            inner: err,
        })?;

    let mut translate_output = SomeIntel8080Translator::new(translator_exe_path);

    translate_output.source_code_path(&temp_src_file_path);

    match file_type {
        TranslateFileType::Csv => translate_output.csv(),
        TranslateFileType::Docx => translate_output.docx(),
        TranslateFileType::Md => translate_output.markdown(),
        TranslateFileType::Txt => &mut translate_output,
    };

    translate_output
        .execute()
        .map_err(|err| TryTranslateError {
            kind: TryTranslateErrorType::ExecutableRun,
            inner: err,
        })?;

    let out_file_path = temp_src_file_path
        .with_extension(format!("i8080asm.{}", file_type.to_string().to_lowercase()));

    let mut cmd = Command::new(match env::consts::OS {
        "macos" => "open",
        "linux" => "xdg-open",
        "windows" => "",
        _ => panic!("unsupported OS"),
    })
    .arg(out_file_path)
    .spawn()
    .map_err(|err| TryTranslateError {
        kind: TryTranslateErrorType::BinaryFileOpen,
        inner: err,
    })?;

    cmd.wait().map_err(|err| TryTranslateError {
        kind: TryTranslateErrorType::BinaryFileOpen,
        inner: err,
    })?;

    // Wait some time before file got deleted
    thread::sleep(time::Duration::from_millis(1500));

    Ok(())
}

pub fn translate_to_docx_and_open(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<(), TryTranslateError> {
    translate_to_file_and_open(source_code, translator_exe_path, TranslateFileType::Docx)
}

pub fn translate_to_csv_and_open(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<(), TryTranslateError> {
    translate_to_file_and_open(source_code, translator_exe_path, TranslateFileType::Csv)
}

pub fn translate_to_txt_and_open(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<(), TryTranslateError> {
    translate_to_file_and_open(source_code, translator_exe_path, TranslateFileType::Txt)
}

pub fn translate_to_markdown_and_open(
    source_code: &str,
    translator_exe_path: &Path,
) -> Result<(), TryTranslateError> {
    translate_to_file_and_open(source_code, translator_exe_path, TranslateFileType::Md)
}

pub fn parse_assembly_line(line: &str) -> AssemblyListingLine {
    let parts: Vec<&str> = line.split(['|', ';']).collect();
    if parts.len() < 5 {
        panic!("Invalid format");
    }

    let address = match u16::from_str_radix(parts[0].trim(), 16) {
        Ok(x) => Some(x),
        Err(_) => None,
    };

    let bytes_str = parts[1].trim();
    let bytes: Vec<u8> = bytes_str
        .chars()
        .collect::<Vec<char>>()
        .chunks(2)
        .map(|chunk| u8::from_str_radix(&chunk.iter().collect::<String>(), 16).unwrap())
        .collect();

    let label = parts[2].trim().to_string();

    let assembly_code = parts[3].trim().to_string();

    let comment = parts[4].trim().to_string();

    AssemblyListingLine {
        address,
        label,
        assembly_code,
        bytes,
        comment,
    }
}

pub fn parse_monitor_system(path: &Path) -> Vec<AssemblyListingLine> {
    let file = File::open(path).unwrap();

    BufReader::new(file)
        .lines()
        .skip(1)
        .flatten()
        .map(|x| parse_assembly_line(&x))
        .collect()
}

#[cfg(test)]
mod tests {
    use crate::translator_service::{
        parse_assembly_line, parse_monitor_system, translate_assembly_to_binary,
        translate_to_docx_and_open,
    };
    use std::path::Path;

    #[test]
    fn test__translate_assembly_to_binary__first_element_is_27() {
        let res = translate_assembly_to_binary("DAA", Path::new("i8080")).unwrap();

        assert_eq!(res.binary_data[0], 0x27);
    }

    #[test]
    fn test__translate_assembly_to_binary__first_element_is_27_and_has_listing() {
        let res = translate_assembly_to_binary("DAA", Path::new("i8080")).unwrap();

        assert_eq!(res.binary_data[0], 0x27);

        assert_eq!(res.listing_data.len(), 1);
        assert_eq!(res.listing_data[0].bytes, [0x27]);
        assert_eq!(res.listing_data[0].assembly_code, "DAA");
    }

    #[test]
    fn test__translate_to_docx_and_open() {
        assert!(translate_to_docx_and_open("DAA", Path::new("i8080")).is_ok())
    }

    #[test]
    fn test__parse_assembly_line() {
        let res = parse_assembly_line("1234 | 21AF12 | MLA:  | LXI H,12AFH ; SOME COMMENT  ");

        assert_eq!(res.address.unwrap(), 0x1234);

        assert_eq!(res.bytes, [0x21, 0xAF, 0x12]);
        assert_eq!(res.label, "MLA:");

        assert_eq!(res.assembly_code, "LXI H,12AFH");
        assert_eq!(res.comment, "SOME COMMENT");
    }

    #[test]
    fn test__parse_assembly_line__empty() {
        let res = parse_assembly_line(" |  |   |  ;  ");

        assert!(res.address.is_none());

        assert_eq!(res.bytes.len(), 0);

        assert_eq!(res.label, "");

        assert_eq!(res.assembly_code, "");
        assert_eq!(res.comment, "");
    }

    #[test]
    fn test__parse_monitor_system() {
        let res = parse_monitor_system(Path::new("monitor.i8080asm.txt"));

        let line105 = &res[103];

        assert_eq!(line105.address, Some(0x0041));
        assert_eq!(line105.bytes, [0xC2, 0xC8, 0x00]);
        assert_eq!(line105.label, "");
        assert_eq!(line105.assembly_code, "JNZ PPER");
        assert_eq!(
            line105.comment,
            "- ЕСЛИ НЕТ (ПОПАЛИ НА RST 0 ИЗ-ЗА ОШИБКИ СТЕКА ПОЛЬЗОВАТЕЛЯ)"
        );
    }
}
