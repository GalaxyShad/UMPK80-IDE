import { Layout } from 'flexlayout-react'
import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { UMPK80State, useUMPK80Store } from '@/store/umpk.ts'
import { useDockLayout } from '@/hooks/useDockLayout.tsx'

import 'flexlayout-react/style/dark.css'
import Toolbar from '@/components/Toolbar.tsx'
import SideMenu from '@/components/SideMenu.tsx'
import { SettingsContext } from '@/components/SettingsContext.tsx'

const fetchState = async () => {
  const umpkState = await invoke<UMPK80State>('umpk_get_state')

  useUMPK80Store.setState({
    ...umpkState,
    stackStart: (umpkState as unknown as { stack_start: number }).stack_start,
    digit: [...umpkState.digit],
    registers: { ...umpkState.registers },
    stack: [...umpkState.stack],
  })

  window.requestAnimationFrame(fetchState)
}

export default function DockLayout() {
  useEffect(() => {
    window.requestAnimationFrame(fetchState)
  }, [])

  const [model, factory, saveLayout] = useDockLayout()

  return (
    <main className="flex flex-col h-screen w-screen">
      <Toolbar />
      <div className="flex flex-row w-full h-full">
        <SettingsContext>
          <SideMenu/>
          {model && <Layout model={model} factory={factory} onModelChange={saveLayout} />}
        </SettingsContext>
      </div>
    </main>
  )
}
