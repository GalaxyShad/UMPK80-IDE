"use client"

import SideMenu from "@/components/side-menu";
import Toolbar from "@/components/toolbar";
import UmpkCodeEditor from "@/components/umpk-code-editor";
import UmpkTerminal from "@/components/umpk-terminal";
import UmpkTab from "@/components/umpk-tab";
import {UMPK80State, useUMPK80Store} from "@/store/umpk";
import {ReactNode, useEffect, useRef, useState} from "react";
import {UmpkStack} from "@/components/umpkStack";
import {SettingsContext} from "@/components/settingsContext";
import {Layout, Model, TabNode} from 'flexlayout-react';

import 'flexlayout-react/style/dark.css';
import RamTab, {RomTab} from "@/components/RamTab.";
import {invoke} from "@tauri-apps/api/tauri";
import UmpkProgramView from "@/components/UmpkProgramView";
import Intel8080AssemblyGuideTab from "@/components/Intel8080AssemblyGuideTab";
import {defaultLayout} from "@/components/defaultLayout";

export default function SPA() {
  const [flexLayoutModel, setFlexLayoutModel] = useState<Model>();
  const layoutRef = useRef<Layout | null>(null);

  const fetchState = async () => {
    const umpkState = await invoke<UMPK80State>('umpk_get_state');

    useUMPK80Store.setState({
      ...umpkState,
      stackStart: (umpkState as any).stack_start,
      digit: [...umpkState.digit],
      registers: {...umpkState.registers},
      stack: [...umpkState.stack],
    });

    window.requestAnimationFrame(fetchState);
  }

  useEffect(() => {
    window.requestAnimationFrame(fetchState);
  }, []);

  useEffect(() => {
    let model;

    try {
      const savedLayoutJson = JSON.parse(localStorage.getItem("layout") ?? 'undefined');

      setFlexLayoutModel(Model.fromJson(savedLayoutJson));
    } catch (e) {
      console.error(e);

      setFlexLayoutModel(Model.fromJson(defaultLayout));
    }
  }, []);

  const factory = (node: TabNode): ReactNode => {
    const component = node.getComponent();

    const map = {
      [UmpkCodeEditor.name]: <UmpkCodeEditor/>,
      [UmpkTab.name]: <UmpkTab/>,
      [UmpkTerminal.name]: <UmpkTerminal/>,
      [UmpkStack.name]: <UmpkStack/>,
      [RamTab.name]: <RamTab/>,
      [RomTab.name]: <RomTab/>,
      [UmpkProgramView.name]: <UmpkProgramView/>,
      [Intel8080AssemblyGuideTab.name]: <Intel8080AssemblyGuideTab/>,
    } as Record<string, ReactNode>

    return map[component ?? '']
  }

  return (
    <main className="flex h-full flex-col">
      <Toolbar/>
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu/>
          {flexLayoutModel &&
              <Layout onModelChange={(model) => localStorage.setItem("layout", JSON.stringify(model.toJson()))}
                      ref={layoutRef} model={flexLayoutModel} factory={factory}/>}
        </SettingsContext>
      </div>
    </main>)
}