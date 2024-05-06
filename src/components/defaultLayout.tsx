import {UmpkStack} from "@/components/umpkStack";
import Intel8080AssemblyGuideTab from "@/components/Intel8080AssemblyGuideTab";
import UmpkProgramView from "@/components/UmpkProgramView";
import RamTab, {RomTab} from "@/components/RamTab.";
import UmpkCodeEditor from "@/components/umpk-code-editor";
import UmpkTerminal from "@/components/umpk-terminal";
import UmpkTab from "@/components/umpk-tab";
import {IJsonModel} from "flexlayout-react";

export const defaultLayout = {
  global: {
    splitterSize: 4,
    tabEnableRename: false,
    tabEnableRenderOnDemand: false
  },
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
            name: "Intel 8080 Docs",
            component: Intel8080AssemblyGuideTab.name,
          },
          {
            type: "tab",
            name: "Program",
            component: UmpkProgramView.name,
          },
          {
            type: "tab",
            name: "RAM",
            component: RamTab.name,
          },
          {
            type: "tab",
            name: "ROM",
            component: RomTab.name,
          },
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