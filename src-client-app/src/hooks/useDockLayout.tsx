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
  'global': {
    'splitterSize':
      4, 'tabEnableRename':
      false, 'tabEnableRenderOnDemand':
      false,
  },
  'borders': [],
  'layout':
    {
      'type':
        'row', 'id':
        '#177df9cb-602e-4f01-afb1-ce9fabce4124', 'children':
        [{
          'type': 'row',
          'id': '#36511cc6-9d8f-4f9e-9b68-b321ada2b5ca',
          'weight': 59.87599645704163,
          'children': [{
            'type': 'tabset',
            'id': '#04dafc5e-7c06-49b1-b45b-e75e049c8eb0',
            'weight': 74.16173570019724,
            'children': [{ 'type': 'tab', 'id': 'CodeEditorTab', 'name': 'Code Editor', 'component': 'CodeEditorTab' }],
          }, {
            'type': 'tabset',
            'id': '#0411aee0-547b-4ca5-926d-7aa202da594e',
            'weight': 25.838264299802763,
            'children': [{ 'type': 'tab', 'id': 'TerminalTab', 'name': 'Terminal', 'component': 'TerminalTab' }],
          }],
        }, {
          'type': 'tabset',
          'id': 'main',
          'weight': 40.12400354295837,
          'children': [{
            'type': 'tab',
            'id': 'UmpkTab',
            'name': 'UMPK-80',
            'component': 'UmpkTab',
            'enableClose': false,
          }],
          'active': true,
        }],
    },
} as IJsonModel


function layoutFactory(node: TabNode): ReactNode {
  const component = node.getComponent()

  try {
    return node.isVisible() && tabsMap[component ?? ''][1]()
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