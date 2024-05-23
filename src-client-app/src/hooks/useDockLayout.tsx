import { IJsonModel, Model, TabNode } from 'flexlayout-react'
import { ReactNode } from 'react'

import UmpkTab from '@/tabs/UmpkTab.tsx'
import TerminalTab from '@/tabs/TerminalTab.tsx'
import UmpkStackTab from '@/tabs/UmpkStackTab.tsx'
import UmpkRomTab from '@/tabs/UmpkRomTab.tsx'
import UmpkRamTab from '@/tabs/UmpkRamTab.tsx'
import UmpkProgramTab from '@/tabs/UmpkProgramTab.tsx'
import Intel8080AssemblyGuideTab from '@/tabs/Intel8080AssemblyGuideTab.tsx'
import CodeEditorTab from '@/tabs/CodeEditorTab.tsx'
import { Intel8080CommandsTab } from '@/tabs/Intel8080CommandsTab.tsx'

const tabsMap = {
  [CodeEditorTab.name]: ['Code Editor', () => <CodeEditorTab />],
  [UmpkTab.name]: ['UMPK-80', () => <UmpkTab />],
  [TerminalTab.name]: ['Terminal', () => <TerminalTab />],
  [UmpkStackTab.name]: ['UMPK-80 Stack', () => <UmpkStackTab />],
  [UmpkRamTab.name]: ['UMPK-80 RAM', () => <UmpkRamTab />],
  [UmpkRomTab.name]: ['UMPK-80 ROM', () => <UmpkRomTab />],
  [UmpkProgramTab.name]: ['UMPK-80 Program', () => <UmpkProgramTab />],
  [Intel8080AssemblyGuideTab.name]: ['Intel 8080 Assembly Guide', () => <Intel8080AssemblyGuideTab />],
  [Intel8080CommandsTab.name]: ['Intel 8080 Commands', () => <Intel8080CommandsTab />],
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
    children:
      [{
        type: 'row',
        weight: 59.87599645704163,
        children: [{
          type: 'tabset',
          weight: 74.16173570019724,
          children: [{ type: 'tab', id: CodeEditorTab.name, name: 'Code Editor', component: CodeEditorTab.name }],
        }, {
          type: 'tabset',
          weight: 25.838264299802763,
          children: [{ type: 'tab', id: TerminalTab.name, name: 'Terminal', component: TerminalTab.name }],
        }],
      }, {
        type: 'tabset',
        id: 'main',
        weight: 40.12400354295837,
        children: [{
          type: 'tab',
          id: UmpkTab.name,
          name: 'UMPK-80',
          component: UmpkTab.name,
          enableClose: false,
        }],
        active: true,
      }],
  },
} as IJsonModel


function layoutFactory(node: TabNode): ReactNode {
  const component = node.getComponent()

  try {
    return node.isVisible() && tabsMap[component ?? '']?.[1]()
  } catch (e) {
    console.error(e)
    localStorage.setItem('layout', '')
  }
}

const saveLayout = () => localStorage.setItem('layout', JSON.stringify(dockLayoutModel?.toJson()))

let dockLayoutModel: Model | undefined = undefined

const loadLayout = () => {
  try {
    const savedLayoutJson = JSON.parse(localStorage.getItem('layout') ?? 'undefined')

    dockLayoutModel = Model.fromJson(savedLayoutJson)
  } catch (e) {
    console.warn(e)

    dockLayoutModel = Model.fromJson(defaultLayout)
  }
}

loadLayout()

export { dockLayoutModel, saveLayout, layoutFactory }