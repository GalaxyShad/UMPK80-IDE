import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";

const terminal = new Terminal({
  theme: {
    background: "#fdf6e300"
  }
})

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

function useTerminal(): [Terminal, FitAddon] {
  return [terminal, fitAddon];
}

export { useTerminal as getTerminal };