"use client"

import {Terminal} from "@xterm/xterm";

let terminal: Terminal;

// should be called in window context
function createTerminal() {
  terminal = new Terminal({
    theme: {
      background: "#fdf6e300"
    }
  });

  return terminal;
}

function useTerminal(): Terminal {
  return terminal;
}

export {useTerminal as getTerminal, createTerminal};