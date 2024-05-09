import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

const translatorTerminal = new Terminal({
  theme: {
    background: '#fdf6e300',
  },
})
const fitAddon = new FitAddon()
translatorTerminal.loadAddon(fitAddon)

translatorTerminal.writeln('Welcome to UMPK-80 Emulator!!! Hope you will like it!')

export { translatorTerminal, fitAddon }