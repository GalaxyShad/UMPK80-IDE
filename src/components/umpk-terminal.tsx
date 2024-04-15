"use client";

import React, { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

type Props = {
  terminal: Terminal;
};

export default function UmpkTerminal({ terminal }: Props) {
  const refDivTerminal = useRef<HTMLDivElement>(null);
  const fitAddon = useRef<FitAddon>(new FitAddon());

  useEffect(() => {
    console.log(refDivTerminal.current);

    if (refDivTerminal.current !== null) {
      terminal.loadAddon(fitAddon.current);
      terminal.open(refDivTerminal.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.current.fit();
      });

      resizeObserver.observe(refDivTerminal.current);
    }

    return () => {
      terminal.dispose();
    };
  }, [terminal]);

  return <div className="w-full h-full" ref={refDivTerminal} />;
}
