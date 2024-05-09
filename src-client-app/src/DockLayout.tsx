import { Layout } from 'flexlayout-react'
import { useDockLayout } from '@/hooks/useDockLayout.tsx'

import 'flexlayout-react/style/dark.css'
import Toolbar from '@/components/Toolbar.tsx'
import SideMenu from '@/components/SideMenu.tsx'
import { SettingsContext } from '@/components/SettingsContext.tsx'

export default function DockLayout() {
  const [model, factory, saveLayout] = useDockLayout()

  return (
    <main className="flex flex-col h-screen w-screen">
      <Toolbar />
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu />
          {model && <Layout model={model} factory={factory} onModelChange={saveLayout} />}
        </SettingsContext>
      </div>
    </main>
  )
}
