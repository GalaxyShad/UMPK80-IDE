"use client";
import { Label } from "@/components/ui/label";
import { HexInput } from "@/components/ui/hex-input";

export function UmpkRegistersControl() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="a">A</Label>
        <HexInput className="h-full" id="a" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="m">M</Label>
        <HexInput className="h-full" readOnly id="m" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="b">B</Label>
        <HexInput className="h-full" id="b" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="c">C</Label>
        <HexInput className="h-full" id="c" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="d">D</Label>
        <HexInput className="h-full" id="d" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="e">E</Label>
        <HexInput className="h-full" id="e" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="h">H</Label>
        <HexInput className="h-full" id="h" />
      </div>
      <div className="flex items-center space-x-2 h-full">
        <Label htmlFor="l">L</Label>
        <HexInput className="h-full" id="l" />
      </div>
      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label htmlFor="pc">PC</Label>
        <HexInput bytesLen={2} className="h-full" id="pc" />
      </div>
      <div className="flex items-center space-x-2 h-full col-span-2">
        <Label htmlFor="sp">SP</Label>
        <HexInput bytesLen={2} className="h-full" id="sp" />
      </div>
    </div>
  );
}
