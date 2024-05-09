import Editor, { Monaco } from '@monaco-editor/react'

import { useEditorStore } from '@/store/editor-store.ts'
import { intel8080Conf, intel8080Language } from '@/intel8080.ts'
import { useTheme } from '@/components/ThemeProvider.tsx'

export default function CodeEditorTab() {
  const sourceCode = useEditorStore((state) => state.sourceCode)
  const setSourceCode = useEditorStore((state) => state.setSourceCode)

  const { theme } = useTheme()

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.register({ id: 'intel8080asm' })
    monaco.languages.setMonarchTokensProvider('intel8080asm', intel8080Language)
    monaco.languages.setLanguageConfiguration('intel8080asm', intel8080Conf)

    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
      command: 'editor.action.fontZoomIn',
    })

    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus,
      command: 'editor.action.fontZoomOut',
    })
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="intel8080asm"
      theme={`vs-${theme}`}
      value={sourceCode}
      onChange={(x) => setSourceCode(x ?? '')}
      beforeMount={handleEditorWillMount}
    />
  )
}
