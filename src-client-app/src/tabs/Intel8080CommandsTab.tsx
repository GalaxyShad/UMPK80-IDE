import { docIntel8080Commands } from '@/assets/docIntel8080Commands.ts'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

export function Intel8080CommandsTab() {
  console.log({ docIntel8080Commands })

  const da = Array(256).fill(0).map((_, i) => docIntel8080Commands.find(x => x.code === i) ?? {
    code: i,
    name: '-',
    description: '-',
  })

  return (
    <div>
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
                      className="border flex text-foreground/25 text-center justify-center items-center px-1 w-full h-full m-auto">
                      {x.name}
                    </div>
                  </div>
                  <div className="flip-card-back flex justify-center items-center">
                    {x.code.toHexString()}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent alignOffset={64} align="start" className="w-48 border-primary/50">
              <div className="flex flex-row justify-between">
                <div className="mb-2 font-bold">
                  {x.name}
                </div>
                <div>
                  {x.code.toHexString()}
                </div>
              </div>
              <div>
                {x.description}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}