// import { docIntel8080Commands } from '@/assets/docIntel8080Commands.ts'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { cn } from '@/lib/utils';

import { default as docIntel8080Commands } from '@/assets/docCommands.json'

const GroopCommand = {
  ["Undocumented"]: "text-zinc-400",
  ["Misc"]: "text-purple-400",
  ["Jumps"]: "text-orange-400",
  ["8bit load"]: "text-blue-400",
  ["16bit load"]: "text-green-400",
  ["8bit arithmetic"]: "text-yellow-400",
  ["16bit arithmetic"]: "text-pink-400",
} as Record<string, string>

export function Intel8080CommandsTab() {
  console.log({ docIntel8080Commands })

  const da = Array(256).fill(0).map((_, i) => docIntel8080Commands.find(x => +("0x" + x.hexOpcode) === i) ?? {
    hexOpcode: "-",
    decimalOpcode: "",
    binaryOpcode: "",
    mnemonic: "-",
    argument1: "",
    argument2: "",
    cycles: "",
    mask: "",
    flags: "",
    tags: "",
    bytesCount: "1",
    flagsAffected: [],
    functionDescription: "",
    rusDescription: ""
  })

  return (
    <div className="overflow-auto min-w-[1400px]">
      <div className="grid grid-cols-16 w-full font-mono">
        {Array(16).fill(0).map((_, i) => (<div className="flex text-center justify-center">{i.toHexString()}</div>))}
      </div>
      <div className="grid grid-cols-16 w-full font-mono">
        {da.map(x => (
          <Tooltip delayDuration={0} disableHoverableContent>
            <TooltipTrigger>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div
                      className={cn(GroopCommand[x.tags[0]], "border flex text-center justify-center items-center px-1 w-full h-full m-auto")}>
                      {cn(x.mnemonic, [x.argument1, x.argument2].filter(y => y).join(","))}
                    </div>
                  </div>
                  <div className="flip-card-back flex justify-center items-center">
                    {x.hexOpcode}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent alignOffset={64} align="start" className="min-w-48 max-w-96 border-primary/50">
              <div className="flex flex-row gap-2">
                <div className="mb-2 font-bold">
                  {x.mnemonic} {[x.argument1, x.argument2].filter(y => y).join(",")}
                </div>
                <div>
                  ({x.hexOpcode})
                </div>
              </div>
              <div>
                {x.functionDescription}
              </div>
              <div>
                Влияет на флаги: {x.flagsAffected.length !== 0 ? x.flagsAffected.join(' ') : "-"}
              </div>
              <div>
                Описание: {x.rusDescription}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}