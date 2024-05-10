import { IJsonModel, Model, TabNode } from 'flexlayout-react'
import { ReactNode, useEffect, useState } from 'react'

import UmpkTab from '@/tabs/UmpkTab.tsx'
import TerminalTab from '@/tabs/TerminalTab.tsx'
import UmpkStackTab from '@/tabs/UmpkStackTab.tsx'
import UmpkRomTab from '@/tabs/UmpkRomTab.tsx'
import UmpkRamTab from '@/tabs/UmpkRamTab.tsx'
import UmpkProgramTab from '@/tabs/UmpkProgramTab.tsx'
import Intel8080AssemblyGuideTab from '@/tabs/Intel8080AssemblyGuideTab.tsx'
import CodeEditorTab from '@/tabs/CodeEditorTab.tsx'

const tabsMap = {
  [CodeEditorTab.name]: ['Code Editor', () => <CodeEditorTab />],
  [UmpkTab.name]: ['UMPK-80', () => <UmpkTab />],
  [TerminalTab.name]: ['Terminal', () => <TerminalTab />],
  [UmpkStackTab.name]: ['UMPK-80 Stack', () => <UmpkStackTab />],
  [UmpkRamTab.name]: ['UMPK-80 RAM', () => <UmpkRamTab />],
  [UmpkRomTab.name]: ['UMPK-80 ROM', () => <UmpkRomTab />],
  [UmpkProgramTab.name]: ['UMPK-80 Program', () => <UmpkProgramTab />],
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

  return node.isVisible() && tabsMap[component ?? ''][1]()
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
