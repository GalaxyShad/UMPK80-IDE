"use client";
import { Label } from "@/components/ui/label";
import { HexInput } from "@/components/ui/hex-input";
import { RegistersPayload } from "./RegistersPayload";

interface Props {
  registers: RegistersPayload
};

export function UmpkRegistersControl({registers}: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="a">A</Label>
        <HexInput value={registers.a} className="h-full" id="a" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="m">M</Label>
        <HexInput value={registers.m} className="h-full" readOnly id="m" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="b">B</Label>
        <HexInput value={registers.b} className="h-full" id="b" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="c">C</Label>
        <HexInput value={registers.c} className="h-full" id="c" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="d">D</Label>
        <HexInput value={registers.d} className="h-full" id="d" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="e">E</Label>
        <HexInput value={registers.e} className="h-full" id="e" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="h">H</Label>
        <HexInput value={registers.h} className="h-full" id="h" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="l">L</Label>
        <HexInput value={registers.l} className="h-full" id="l" />
      </div>
      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label htmlFor="pc">PC</Label>
        <HexInput value={registers.pc} bytesLen={2} className="h-full" id="pc" />
      </div>
      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label htmlFor="sp">SP</Label>
        <HexInput value={registers.sp} bytesLen={2} className="h-full" id="sp" />
      </div>
    </div>
  );
}
