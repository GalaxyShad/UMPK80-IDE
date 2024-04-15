import React, { HTMLProps, ReactNode } from "react";
import { Button } from "./ui/button";

import { invoke } from "@tauri-apps/api/tauri";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export enum KeyboardKey {
  _D,
  _E,
  _F,
  _A,
  _B,
  _C,
  _7,
  _8,
  _9,
  _4,
  _5,
  _6,
  _1,
  _2,
  _3,
  _0,
  ZP_UV,
  UM,
  P,
  OT_RG,
  OT_A,
  SHK,
  PR_SCH,
  SHC,
  R,
  ST,
}

function KeyboardButton({
  value,
  children,
  className,
  disabled,
}: {
  value: KeyboardKey;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="secondary"
      disabled={disabled}
      className={className + " h-12"}
      onMouseDown={() => invoke("umpk_press_key", { key: value })}
      onMouseUp={() => invoke("umpk_release_key", { key: value })}
      onMouseLeave={() => invoke("umpk_release_key", { key: value })}
    >
      {children}
    </Button>
  );
}

interface Button {
  binary: KeyboardKey;
  name: string;
  startWithNextCol: boolean;
}

interface KeyboardProps {
  className?: string;
  pressedKeys?: KeyboardKey[];
}

export function UmpkKeyboardNumber({ className, pressedKeys }: KeyboardProps) {
  const buttons = [
    { name: "C", binary: KeyboardKey._C },
    { name: "D", binary: KeyboardKey._D },
    { name: "E", binary: KeyboardKey._E },
    { name: "F", binary: KeyboardKey._F },

    { name: "8", binary: KeyboardKey._8 },
    { name: "9", binary: KeyboardKey._9 },
    { name: "A", binary: KeyboardKey._A },
    { name: "B", binary: KeyboardKey._B },

    { name: "4", binary: KeyboardKey._4 },
    { name: "5", binary: KeyboardKey._5 },
    { name: "6", binary: KeyboardKey._6 },
    { name: "7", binary: KeyboardKey._7 },

    { name: "0", binary: KeyboardKey._0 },
    { name: "1", binary: KeyboardKey._1 },
    { name: "2", binary: KeyboardKey._2 },
    { name: "3", binary: KeyboardKey._3 },
  ] as Button[];

  return (
    <div className={"grid grid-cols-4 gap-2 " + className}>
      {buttons.map((btn) => (
        <KeyboardButton
          className={
            pressedKeys?.includes(btn.binary) ? "bg-primary" : undefined
          }
          key={btn.binary}
          value={btn.binary}
        >
          {btn.name}
        </KeyboardButton>
      ))}
    </div>
  );
}

export function UmpkKeyboardControl({ className, pressedKeys }: KeyboardProps) {
  const buttons = [
    { name: "R", binary: KeyboardKey.R, startWithNextCol: true },
    { name: "ШЦ", binary: KeyboardKey.SHC },
    { name: "ШК", binary: KeyboardKey.SHK, startWithNextCol: true },
    { name: "Пр Сч", binary: KeyboardKey.PR_SCH },

    { name: "Ст", binary: KeyboardKey.ST },
    { name: "От Рг", binary: KeyboardKey.OT_RG },
    { name: "От А", binary: KeyboardKey.OT_A },

    { name: "П", binary: KeyboardKey.P },
    { name: "Ум", binary: KeyboardKey.UM },
    { name: "Зп Ув", binary: KeyboardKey.ZP_UV },
  ] as Button[];

  return (
    <div className={"grid grid-cols-3 gap-2 " + className}>
      {buttons.map((btn) => (
        <KeyboardButton
          className={cn(
            pressedKeys?.includes(btn.binary) ? "bg-primary" : undefined,
            btn.startWithNextCol ? "col-start-2" : undefined
          )}
          key={btn.binary}
          value={btn.binary}
        >
          {btn.name}
        </KeyboardButton>
      ))}
    </div>
  );
}
