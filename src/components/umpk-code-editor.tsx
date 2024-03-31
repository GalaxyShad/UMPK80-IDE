import { intel8080Conf, intel8080Language } from "@/monaco-languages/intel8080";
import Editor, { DiffEditor, useMonaco, loader, Monaco } from "@monaco-editor/react";

import React from "react";

type Props = {};

const dummyData = `
ORG 0800h
INIT:
    LXI H, 0902h    ; Pointer initialization
    MOV C, M        ; Read subtractor
    DCX H           ; Pointer decrement
    MOV A, M        ; Reading the second summand
    DCX H           ; Pointer decrement
    ADD M           ; Adding the second summand to the first summand
    JC  M0          ; Jump if the resulting number is greater than FFh
    SUB C           ; Subtraction 
    JC  BAD         ; Jump if the resulting number is negative
    JMP LESS_100    ; Jump to check the number less than 100h
M0:
    SUB C           ; Subtraction 
    JNC GREATER_FF  ; Jump if the number is greater than FFh


LESS_100:
    CPI 0F7h        ; Comparison to check if the number is outside the leftmost boundary of the interval
    JC  BAD         ; Jump if the number is outside the limits
    JMP GOOD        ; Otherwise, pass to output the number of successful fulfillment of the condition
GREATER_FF:
    ANI 0FEh        ; Allocation of all bits except the first one
    JZ GOOD         ; Jump if the number is equal to 100h or 101h


BAD:
    MVI A, 70h      ; Writing to the accumulator the number 70h when the result is NOT within the interval.
    JMP PRINT       ; Jump to output the result of the analysis to port 05h
GOOD:
    MVI A, 07h      ; Write 07h to the accumulator when the result falls within the interval.


PRINT:
    OUT 05h         ; Output analysis result to port 05h
    RST 1           ; Stop`;

export default function UmpkCodeEditor({}: Props) {
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
      defaultValue={dummyData}
      beforeMount={handleEditorWillMount}
    />
  );
}