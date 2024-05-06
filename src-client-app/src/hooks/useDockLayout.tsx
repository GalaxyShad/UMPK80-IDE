import { IJsonModel, Model, TabNode } from 'flexlayout-react'
import UmpkTab from '@/tabs/UmpkTab.tsx'
import TerminalTab from '@/tabs/TerminalTab.tsx'
import { UmpkStackTab } from '@/tabs/UmpkStackTab.tsx'
import UmpkRamTab, { RomTab } from '@/tabs/UmpkRamTab..tsx'
import UmpkProgramView from '@/components/umpk/UmpkProgramView.tsx'
import Intel8080AssemblyGuideTab from '@/components/Intel8080AssemblyGuideTab.tsx'
import { ReactNode, useEffect, useState } from 'react'
import CodeEditorTab from '@/components/CodeEditorTab.tsx'

const tabsMap = {
  [CodeEditorTab.name]: ['Code Editor', () => <CodeEditorTab />],
  [UmpkTab.name]: ['UMPK-80',() => <UmpkTab />],
  [TerminalTab.name]: ['Terminal', () => <TerminalTab />],
  [UmpkStackTab.name]: ['UMPK-80 Stack', () => <UmpkStackTab />],
  [UmpkRamTab.name]: ['UMPK-80 RAM', () => <UmpkRamTab />],
  [RomTab.name]: ['UMPK-80 ROM', () => <RomTab />],
  [UmpkProgramView.name]: ['UMPK-80 Program', () => <UmpkProgramView />],
  [Intel8080AssemblyGuideTab.name]: ['Intel 8080 Assembly Guide', () => <Intel8080AssemblyGuideTab />],
} as Record<string, [string, () => ReactNode]>

const defaultLayout = {
  global: {
    splitterSize: 4,
    tabEnableRename: false,
    tabEnableRenderOnDemand: false,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 100,
        children: Object.keys(tabsMap).map((key) => ({
          type: 'tab',
          name: tabsMap[key][0],
          component: key,
        })),
      },
    ],
  },
} as IJsonModel

function layoutFactory(node: TabNode): ReactNode {
  const component = node.getComponent()

  return tabsMap[component ?? ''][1]()
}

type UseDockLayoutReturn = [Model | undefined, (node: TabNode) => ReactNode, (model: Model) => void]

export function useDockLayout(): UseDockLayoutReturn {
  const [flexLayoutModel, setFlexLayoutModel] = useState<Model>()

  const loadLayout = () => {
    try {
      const savedLayoutJson = JSON.parse(localStorage.getItem('layout') ?? 'undefined')

      setFlexLayoutModel(Model.fromJson(savedLayoutJson))
    } catch (e) {
      console.error(e)

      setFlexLayoutModel(Model.fromJson(defaultLayout))
    }
  }

  const saveLayout = (model: Model) =>
    localStorage.setItem('layout', JSON.stringify(model.toJson()))

  useEffect(loadLayout, [])

  return [flexLayoutModel, layoutFactory, saveLayout]
}
