"use client";

import React, { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";
import { getTerminal } from "@/services/terminal";

export default function UmpkTerminal() {
  const refDivTerminal = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    console.log(refDivTerminal.current);

    const [terminal, fitAddon] = getTerminal();

    if (refDivTerminal.current !== null) {
      terminal.open(refDivTerminal.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });

      resizeObserver.observe(refDivTerminal.current);
    }

    return () => {
      terminal.dispose();
    };
  }, []);

  return <div className="w-full h-full" ref={refDivTerminal} />;
}
