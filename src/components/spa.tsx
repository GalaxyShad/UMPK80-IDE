"use client"

import SideMenu from "@/components/side-menu";
import Toolbar from "@/components/toolbar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import UmpkCodeEditor from "@/components/umpk-code-editor";
import UmpkTerminal from "@/components/umpk-terminal";
import UmpkTab from "@/components/umpk-tab";
import {startListeningUMPK80} from "@/store/umpk";
import {ReactNode, useEffect} from "react";
import {UmpkStack} from "@/components/umpkStack";
import {SettingsContext} from "@/components/settingsContext";

import {IJsonModel, Layout, Model, TabNode} from 'flexlayout-react';

import 'flexlayout-react/style/dark.css';
import {Terminal} from "@xterm/xterm";

const json = {
  global: {},
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 10,
        children: [
          {
            type: "tab",
            name: "UMPK80 Stack",
            component: UmpkStack.name,
          }
        ]
      },
      {
        type: "tabset",
        weight: 60,
        children: [
          {
            type: "tab",
            name: "Editor",
            component: UmpkCodeEditor.name,
          },
          {
            type: "tab",
            name: "Console",
            component: UmpkTerminal.name,
          },
        ]
      },
      {
        type: "tabset",
        weight: 30,
        children: [
          {
            type: "tab",
            name: "Umpk",
            component: UmpkTab.name,
            enableClose: false
          }
        ]
      }
    ]
  }
} as IJsonModel;

const model = Model.fromJson(json);

const defaultLayout = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        mode: 'vertical',
        children: [{
          tabs: [
            {id: 'editor', title: 'Editor', content: <UmpkCodeEditor/>},
            {id: 'terminal', title: 'Terminal', content: <UmpkTerminal/>},
          ]
        }

        ]
      },
      {
        mode: 'vertical',
        children: [{
          tabs: [
            {id: 'stack', title: 'Stack', content: <UmpkStack/>},
            {id: 'emulator', title: 'Emulator', closable: false, content: <UmpkTab/>},
          ]
        }]
      },
    ]
  }
};

export default function SPA() {

  useEffect(() => {
    const unlisten = startListeningUMPK80();

    return () => {
      unlisten.then(f => f())
    };
  }, [])

  const factory = (node: TabNode): ReactNode => {
    const component = node.getComponent();

    const map = {
      [UmpkCodeEditor.name]: <UmpkCodeEditor/>,
      [UmpkTab.name]: <UmpkTab/>,
      [UmpkTerminal.name]: <UmpkTerminal/>,
      [UmpkStack.name]: <UmpkStack/>,
    } as Record<string, ReactNode>

    return map[component ?? '']
  }

  return (
    <main className="flex h-full flex-col">
      <Toolbar/>
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu/>
          <Layout classNameMapper={(x) => {console.log({x}); return x}} model={model} factory={factory}/>
        </SettingsContext>
      </div>
    </main>)
}