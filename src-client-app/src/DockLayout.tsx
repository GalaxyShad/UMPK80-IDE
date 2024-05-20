import { Layout } from 'flexlayout-react'

import 'flexlayout-react/style/dark.css'
import './docklayout.css'

import Toolbar from '@/components/Toolbar.tsx'
import SideMenu from '@/components/SideMenu.tsx'
import { SettingsContext } from '@/components/SettingsContext.tsx'
import { dockLayoutModel, layoutFactory, saveLayout } from '@/hooks/useDockLayout.tsx'
import { useTheme } from '@/components/ThemeProvider.tsx'
import { cn } from '@/lib/utils.ts'

export default function DockLayout() {
  const { theme } = useTheme()

  return (
    <main className="flex flex-col h-screen w-screen">
      <Toolbar />
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu />
          <div className={cn("w-full h-full", theme === "dark" && "dark")}>
            {dockLayoutModel &&
              <Layout model={dockLayoutModel}
                      factory={layoutFactory} onModelChange={saveLayout} />}
          </div>
        </SettingsContext>
      </div>
    </main>
  )
}
