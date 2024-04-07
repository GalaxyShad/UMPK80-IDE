import { intel8080Conf, intel8080Language } from "@/monaco-languages/intel8080";
import Editor, { DiffEditor, useMonaco, loader, Monaco, OnChange } from "@monaco-editor/react";

import React from "react";

type Props = {
  onChange: OnChange,
  value: string
};

export default function UmpkCodeEditor({value, onChange}: Props) {
  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.register({ id: 'intel8080asm' });
    monaco.languages.setMonarchTokensProvider('intel8080asm', intel8080Language);
    monaco.languages.setLanguageConfiguration('intel8080asm', intel8080Conf);
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="intel8080asm"
      theme="vs-dark"
      onChange={onChange}
      value={value}
      beforeMount={handleEditorWillMount}
    />
  );
}
