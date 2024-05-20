import { create } from 'zustand'

interface EditorState {
  sourceCode: string,
  setSourceCode: (code: string) => void,
}

export const defaultCode = `
ORG 0800h

_H EQU 76h
_E EQU 79h
_L EQU 38h
_O EQU 5Ch

INIT:
    LXI H, 0BFFh
    MVI M, _H
    DCX H 
    MVI M, _E
    DCX H 
    MVI M, _L
    DCX H 
    MVI M, _L
    DCX H 
    MVI M, _O
    DCX H 
    MVI M, 0

LOOP:
    CALL 01C8h
    JMP LOOP
`

export const useEditorStore = create<EditorState>()((set) => ({
  sourceCode: defaultCode,
  setSourceCode: (code: string) => set((state) => ({ ...state, sourceCode: code })),
}))
