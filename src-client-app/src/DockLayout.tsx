import { Layout } from 'flexlayout-react'

import 'flexlayout-react/style/dark.css'
import Toolbar from '@/components/Toolbar.tsx'
import SideMenu from '@/components/SideMenu.tsx'
import { SettingsContext } from '@/components/SettingsContext.tsx'
import { dockLayoutModel, layoutFactory, saveLayout } from '@/hooks/useDockLayout.tsx'

export default function DockLayout() {
  return (
    <main className="flex flex-col h-screen w-screen">
      <Toolbar />
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu />
          {dockLayoutModel && <Layout model={dockLayoutModel} factory={layoutFactory} onModelChange={saveLayout} />}
        </SettingsContext>
      </div>
    </main>
  )
}
