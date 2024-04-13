import React, { HTMLProps, ReactNode } from "react";
import { Button } from "./ui/button";

import { invoke } from "@tauri-apps/api/tauri";
import { ClassNameValue } from "tailwind-merge";

enum KeyboardKey {
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

export function UmpkKeyboardNumber({ className }: { className?: string }) {
  type Button = {
    key: KeyboardKey;
    realKeyCode: string;
    name: string;
  };

  const keyMap = {
    Digit0: KeyboardKey._0,
    Digit1: KeyboardKey._1,
    Digit2: KeyboardKey._2,
    Digit3: KeyboardKey._3,
    Digit4: KeyboardKey._4,
    Digit5: KeyboardKey._5,
    Digit6: KeyboardKey._6,
    Digit7: KeyboardKey._7,
    Digit8: KeyboardKey._8,
    Digit9: KeyboardKey._9,
    KeyA: KeyboardKey._A,
    KeyB: KeyboardKey._B,
    KeyC: KeyboardKey._C,
    KeyD: KeyboardKey._D,
    KeyE: KeyboardKey._E,
    KeyF: KeyboardKey._F,
  } as Record<string, KeyboardKey>;

  function keyHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    const key = keyMap[e.code];

    if (key !== undefined) {
      invoke("umpk_press_key", { key });
    }
  }

  function keyUpHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    const key = keyMap[e.code];

    if (key !== undefined) {
      invoke("umpk_release_key", { key });
    }
  }

  return (
    <div
      onKeyDown={keyHandler}
      onKeyUp={keyUpHandler}
      className={"grid grid-cols-4 gap-2 " + className}
    >
      <KeyboardButton value={KeyboardKey._C}>C</KeyboardButton>
      <KeyboardButton value={KeyboardKey._D}>D</KeyboardButton>
      <KeyboardButton value={KeyboardKey._E}>E</KeyboardButton>
      <KeyboardButton value={KeyboardKey._F}>F</KeyboardButton>

      <KeyboardButton value={KeyboardKey._8}>8</KeyboardButton>
      <KeyboardButton value={KeyboardKey._9}>9</KeyboardButton>
      <KeyboardButton value={KeyboardKey._A}>A</KeyboardButton>
      <KeyboardButton value={KeyboardKey._B}>B</KeyboardButton>

      <KeyboardButton value={KeyboardKey._4}>4</KeyboardButton>
      <KeyboardButton value={KeyboardKey._5}>5</KeyboardButton>
      <KeyboardButton value={KeyboardKey._6}>6</KeyboardButton>
      <KeyboardButton value={KeyboardKey._7}>7</KeyboardButton>

      <KeyboardButton value={KeyboardKey._0}>0</KeyboardButton>
      <KeyboardButton value={KeyboardKey._1}>1</KeyboardButton>
      <KeyboardButton value={KeyboardKey._2}>2</KeyboardButton>
      <KeyboardButton value={KeyboardKey._3}>3</KeyboardButton>
    </div>
  );
}

export function UmpkKeyboardControl({ className }: { className?: string }) {
  return (
    <div className={"grid grid-cols-3 gap-2 " + className}>
      <KeyboardButton value={KeyboardKey.R} className="col-start-2">
        R
      </KeyboardButton>
      <KeyboardButton disabled value={KeyboardKey.SHC}>
        ШЦ
      </KeyboardButton>

      <KeyboardButton value={KeyboardKey.SHK} className="col-start-2">
        ШК
      </KeyboardButton>
      <KeyboardButton value={KeyboardKey.PR_SCH}>Пр Сч</KeyboardButton>

      <KeyboardButton value={KeyboardKey.ST}>Ст</KeyboardButton>
      <KeyboardButton value={KeyboardKey.OT_RG}>От Рг</KeyboardButton>
      <KeyboardButton value={KeyboardKey.OT_A}>От А</KeyboardButton>

      <KeyboardButton value={KeyboardKey.P}>П</KeyboardButton>
      <KeyboardButton value={KeyboardKey.UM}>Ум</KeyboardButton>
      <KeyboardButton value={KeyboardKey.ZP_UV}>Зп Ув</KeyboardButton>
    </div>
  );
}
