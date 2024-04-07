import React, { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm";

import '@xterm/xterm/css/xterm.css'

type Props = {
  value: string;
};

export default function UmpkTerminal({value}: Props) {
  const refTerminal = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal>(new Terminal());

  useEffect(() => {
    console.log(refTerminal.current);

    if (refTerminal.current !== null)
      terminal.current.open(refTerminal.current);

    return () => {
      terminal.current.dispose();
    }
  }, []);

  useEffect(() => {
    terminal.current.write(value);
    console.log({value});
  }, [value])

  return <div ref={refTerminal} />;
}
