import { Button } from '@/components/ui/Button'
import {
  BetweenHorizonalStart,
  BookText,
  CodeIcon,
  Layers,
  MemoryStick,
  Settings,
  Table2Icon,
  Terminal,
} from 'lucide-react'
import { DialogTrigger } from '@/components/ui/Dialog'
import { dockLayoutModel } from '@/hooks/useDockLayout.tsx'
import { Actions, DockLocation } from 'flexlayout-react'
import UmpkStackTab from '@/tabs/UmpkStackTab.tsx'
import Intel8080AssemblyGuideTab from '@/tabs/Intel8080AssemblyGuideTab.tsx'
import UmpkProgramTab from '@/tabs/UmpkProgramTab.tsx'
import UmpkRomTab from '@/tabs/UmpkRomTab.tsx'
import UmpkRamTab from '@/tabs/UmpkRamTab.tsx'
import TerminalTab from '@/tabs/TerminalTab.tsx'
import { Intel8080CommandsTab } from '@/tabs/Intel8080CommandsTab.tsx'
import CodeEditorTab from '@/tabs/CodeEditorTab.tsx'

function addOrSelectTab(name: string, componentName: string) {
  dockLayoutModel?.doAction(Actions.selectTab(componentName))

  if (dockLayoutModel?.getNodeById(componentName)) {
    return
  }

  const firstTabSetId = dockLayoutModel?.getFirstTabSet().getId() ?? 'main'

  dockLayoutModel?.doAction(Actions.addNode({
    id: componentName,
    type: 'tab',
    name: name,
    component: componentName,
  }, firstTabSetId, firstTabSetId === 'main' ? DockLocation.LEFT : DockLocation.CENTER, 0))
}

export default function SideMenu() {
  return (
    <div className="flex flex-col w-12 h-full bg-card justify-between items-center py-2 border-r">
      <div className="flex flex-col gap-2">
        <Button onClick={() => addOrSelectTab('Code Editor', CodeEditorTab.name)}
                className="text-neutral-600" size="icon" variant="ghost">
          <CodeIcon />
        </Button>
        <Button onClick={() => addOrSelectTab('UMPK80-Program', UmpkProgramTab.name)}
                className="text-neutral-600" size="icon" variant="ghost">
          <BetweenHorizonalStart />
        </Button>
        <Button onClick={() => addOrSelectTab('UMPK80-Stack', UmpkStackTab.name)}
                className="flex flex-col text-neutral-600"
                size="icon" variant="ghost">
          <Layers />
        </Button>
        <Button onClick={() => addOrSelectTab('UMPK80-RAM', UmpkRamTab.name)} className="flex flex-col text-neutral-600"
                size="icon" variant="ghost">
          <MemoryStick />
          RAM
        </Button>
        <Button onClick={() => addOrSelectTab('UMPK80-ROM', UmpkRomTab.name)} className="flex flex-col text-neutral-600"
                size="icon" variant="ghost">
          <MemoryStick />
          ROM
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={() => addOrSelectTab('Intel 8080 Commands', Intel8080CommandsTab.name)}
                className="text-neutral-600" size="icon"
                variant="ghost">
          <Table2Icon />
        </Button>
        <Button onClick={() => addOrSelectTab('Terminal', TerminalTab.name)} className="text-neutral-600" size="icon"
                variant="ghost">
          <Terminal />
        </Button>
        <Button onClick={() => addOrSelectTab('Intel 8080 Assembly Guide', Intel8080AssemblyGuideTab.name)}
                className="text-neutral-600" size="icon" variant="ghost">
          <BookText />
        </Button>
        <DialogTrigger asChild>
          <Button className="text-neutral-600" size="icon" variant="ghost">
            <Settings />
          </Button>
        </DialogTrigger>
      </div>
    </div>
  )
}
