import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { useState } from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  bytesLen?: number;
}

const formatHex = (x: number, pad: number = 2) => x.toString(16).toUpperCase().padStart(pad, "0");

const HexInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, bytesLen, ...props }, ref) => {
    const hexPad = (bytesLen ?? 1) * 2;

    const [strValue, setStrValue] = useState<string>(formatHex(props.value ?? 0, hexPad));

    function change(e: React.ChangeEvent<HTMLInputElement>) {
      const input = e.currentTarget.value.toUpperCase();

      
      const regHex = new RegExp(`^[0-9A-F]{1,${hexPad}}$`);
      console.log(regHex);
      
      if (regHex.test(input) || input === "") {
        const hex = Number.parseInt(input, 16);
        
        setStrValue(input);

        props.onChange?.(hex);
      }

    }

    function blur(e: React.FocusEvent<HTMLInputElement>) {
      if (e.currentTarget.value === "") {
        setStrValue(formatHex(0));

        props.onChange?.(0);
        props.onBlur?.(e);
      }
    }

    return (
      <Input
        {...props}
        type={type}
        className={className}
        ref={ref}
        onChange={change}
        onBlur={blur}
        value={strValue}
        autoComplete="off"
      />
    );
  }
);
HexInput.displayName = "Input";

export { HexInput };
