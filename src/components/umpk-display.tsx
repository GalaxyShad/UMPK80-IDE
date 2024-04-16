"use client";
import { SevenSegmentDisplay } from "./ui/seven-segment-display";

export const UmpkDisplay = ({ pg, digit }: { pg: number; digit: number[]; }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-row">
          <SevenSegmentDisplay value={digit[0]} />
          <SevenSegmentDisplay value={digit[1]} />
          <SevenSegmentDisplay value={digit[2]} />
          <SevenSegmentDisplay value={digit[3]} />
        </div>
        <div className="flex flex-row ml-4">
          <SevenSegmentDisplay value={digit[4]} />
          <SevenSegmentDisplay value={digit[5]} />
        </div>
      </div>
      <h1 className="text-slate-100 w-full text-center">
        {pg.toString(16).padStart(4, "0")}
      </h1>
    </div>
  );
};
