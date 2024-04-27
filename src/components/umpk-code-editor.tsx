import {intel8080Conf, intel8080Language} from "@/monaco-languages/intel8080";
import Editor, {DiffEditor, useMonaco, loader, Monaco, OnChange} from "@monaco-editor/react";

import React from "react";
import {useEditorStore} from "@/store/editor-store";

export default function UmpkCodeEditor() {
  const sourceCode = useEditorStore((state) => state.sourceCode);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.register({id: 'intel8080asm'});
    monaco.languages.setMonarchTokensProvider('intel8080asm', intel8080Language);
    monaco.languages.setLanguageConfiguration('intel8080asm', intel8080Conf);

    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
      command: "editor.action.fontZoomIn"
    })

    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus,
      command: "editor.action.fontZoomOut"
    })

    console.log({monaco});
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="intel8080asm"
      theme="vs-dark"
      value={sourceCode}
      beforeMount={handleEditorWillMount}
    />
  );
}
