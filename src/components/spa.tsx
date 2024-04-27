"use client"

import SideMenu from "@/components/side-menu";
import Toolbar from "@/components/toolbar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import UmpkCodeEditor from "@/components/umpk-code-editor";
import UmpkTerminal from "@/components/umpk-terminal";
import UmpkTab from "@/components/umpk-tab";
import {startListeningUMPK80, useUMPK80Store} from "@/store/umpk";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useEffect, useMemo} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {shallow} from "zustand/shallow";

function UmpkStack() {
  const stack = useUMPK80Store(state => state.stack);
  const stackStart = useUMPK80Store(state => state.stackStart);

  return (
    <ScrollArea>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ADR</TableHead>
            <TableHead>DATA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/*{stack[0]}*/}
          {stack.map((data, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{(stackStart - i).toString(16)}</TableCell>
              <TableCell>{data.toString(16)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default function SPA() {

  useEffect(() => {
    const unlisten = startListeningUMPK80();

    return () => {unlisten.then(f => f())};
  }, [])

  return (
    <main className="flex h-full flex-col">
      <Toolbar/>
      <div className="flex flex-row w-full h-full">
        <SideMenu/>
        <ResizablePanelGroup className="h-full w-full" direction="horizontal">
          <ResizablePanel>
            {/*<UmpkStack/>*/}
          </ResizablePanel>
          <ResizableHandle/>
          <ResizablePanel className="w-full">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel className="w-full">
                <UmpkCodeEditor/>
              </ResizablePanel>
              <ResizableHandle/>
              <ResizablePanel defaultSize={30} className="px-4 pt-4 w-full h-full">
                <UmpkTerminal/>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle/>
          <ResizablePanel
            defaultSize={40}
            className="flex flex-col h-full items-center min-w-[484px]"
          >
            <UmpkTab/>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>)
}