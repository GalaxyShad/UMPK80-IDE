"use client"

import SideMenu from "@/components/side-menu";
import Toolbar from "@/components/toolbar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import UmpkCodeEditor from "@/components/umpk-code-editor";
import UmpkTerminal from "@/components/umpk-terminal";
import UmpkTab from "@/components/umpk-tab";
import {startListeningUMPK80} from "@/store/umpk";
import {useEffect} from "react";
import {UmpkStack} from "@/components/umpkStack";
import {SettingsContext} from "@/components/settingsContext";

import DockLayout from 'rc-dock'
import "rc-dock/dist/rc-dock.css";

export default function SPA() {

  useEffect(() => {
    const unlisten = startListeningUMPK80();

    return () => {
      unlisten.then(f => f())
    };
  }, [])

  return (
    <main className="flex h-full flex-col">
      <Toolbar/>
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu/>
          <ResizablePanelGroup className="h-full w-full" direction="horizontal">
            <ResizablePanel>
              <UmpkStack/>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel className="w-full">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel className="w-full">
                  <UmpkCodeEditor/>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={30} className="px-4 pt-4 ">
                  <UmpkTerminal/>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel
              defaultSize={40}
            >
              <UmpkTab/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SettingsContext>
      </div>
    </main>)
}