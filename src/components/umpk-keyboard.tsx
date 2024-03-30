import React, { ReactNode } from "react";
import { Button } from "./ui/button";

import { invoke } from "@tauri-apps/api/tauri";

type Props = {};

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
}: {
  value: KeyboardKey;
  children: ReactNode;
  className?: string;
}) {
  function sendToBackend(key: KeyboardKey) {
    invoke("umpk_press_key", {key})
  }

  return <Button className={className} onClick={() => sendToBackend(value)}>{children}</Button>;
}

export default function UmpkKeyboard({}: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      <KeyboardButton value={KeyboardKey.R} className="col-start-2">
        R
      </KeyboardButton>
      <KeyboardButton value={KeyboardKey.SHC}>ШЦ</KeyboardButton>
      <KeyboardButton value={KeyboardKey._C}>C</KeyboardButton>
      <KeyboardButton value={KeyboardKey._D}>D</KeyboardButton>
      <KeyboardButton value={KeyboardKey._E}>E</KeyboardButton>
      <KeyboardButton value={KeyboardKey._F}>F</KeyboardButton>

      <KeyboardButton value={KeyboardKey.SHK} className="col-start-2">
        ШК
      </KeyboardButton>
      <KeyboardButton value={KeyboardKey.PR_SCH}>Пр Сч</KeyboardButton>
      <KeyboardButton value={KeyboardKey._8}>8</KeyboardButton>
      <KeyboardButton value={KeyboardKey._9}>9</KeyboardButton>
      <KeyboardButton value={KeyboardKey._A}>A</KeyboardButton>
      <KeyboardButton value={KeyboardKey._B}>B</KeyboardButton>

      <KeyboardButton value={KeyboardKey.ST}>Ст</KeyboardButton>
      <KeyboardButton value={KeyboardKey.OT_RG}>От Рг</KeyboardButton>
      <KeyboardButton value={KeyboardKey.OT_A}>От А</KeyboardButton>
      <KeyboardButton value={KeyboardKey._4}>4</KeyboardButton>
      <KeyboardButton value={KeyboardKey._5}>5</KeyboardButton>
      <KeyboardButton value={KeyboardKey._6}>6</KeyboardButton>
      <KeyboardButton value={KeyboardKey._7}>7</KeyboardButton>

      <KeyboardButton value={KeyboardKey.P}>П</KeyboardButton>
      <KeyboardButton value={KeyboardKey.UM}>Ум</KeyboardButton>
      <KeyboardButton value={KeyboardKey.ZP_UV}>Зп Ув</KeyboardButton>
      <KeyboardButton value={KeyboardKey._0}>0</KeyboardButton>
      <KeyboardButton value={KeyboardKey._1}>1</KeyboardButton>
      <KeyboardButton value={KeyboardKey._2}>2</KeyboardButton>
      <KeyboardButton value={KeyboardKey._3}>3</KeyboardButton>
    </div>
  );
}
