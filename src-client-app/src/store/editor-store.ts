import { create } from 'zustand'

interface EditorState {
  sourceCode: string,
  setSourceCode: (code: string) => void,
}

export const useEditorStore = create<EditorState>()((set) => ({
  sourceCode: '',
  setSourceCode: (code: string) => set((state) => ({ ...state, sourceCode: code })),
}))
