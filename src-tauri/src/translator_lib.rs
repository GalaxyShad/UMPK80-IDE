use std::io::{Error, ErrorKind};
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

pub struct SomeIntel8080Translator {
    exe_path: PathBuf,
    command: Command
}

impl SomeIntel8080Translator {
    pub fn new(exe_path: &Path) -> Self {
        let command = Command::new(exe_path);

        Self {
            exe_path: exe_path.to_path_buf(),
            command,
        }
    }

    pub fn execute(&mut self) -> Result<Output, Error> {
        let output = self
            .command
            .output()
            .map_err(|err| Error::new(ErrorKind::Other, format!(
                "🥺  Unable to run translator executable \"{:?}\".\n\
                    Reason: {}\n\
                    Message: {}\n\
                    {}",
                self.command.get_program(),
                err.kind().to_string(),
                err.to_string(),
                match err.kind() {
                    ErrorKind::NotFound => "💡  Hint: check that executable \"i8080\" of translator \"SomeIntel8080Translator\" is in $PATH variables or configure custom path in IDE settings",
                    _ => ""
                }
            )))?;

        Ok(output)
    }

    pub fn version(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("--version");
        self
    }

    pub fn source_code_path(&mut self, source_code_path: &Path) -> &mut SomeIntel8080Translator {
        self.command.arg(source_code_path);
        self
    }

    pub fn same_line_bytes(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("--samelinebyte");
        self
    }

    pub fn markdown(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("-m");
        self
    }

    pub fn csv(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("--csv");
        self
    }

    pub fn binary(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("--bin");
        self
    }

    pub fn docx(&mut self) -> &mut SomeIntel8080Translator {
        self.command.arg("-w");
        self
    }
}