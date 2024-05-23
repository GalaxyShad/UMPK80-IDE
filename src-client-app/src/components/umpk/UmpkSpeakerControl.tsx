import UmpkIconPanel from '@/components/umpk/UmpkIconPanel.tsx'
import { Volume2 } from 'lucide-react'
import { Slider } from '@/components/ui/Slider.tsx'
import { useEffect } from 'react'
import { useUMPK80Store } from '@/store/umpkStore.ts'
import { umpkGetVolume } from '@/services/umpkService.ts'

export default function UmpkSpeakerControl() {
  const volume = useUMPK80Store(s => s.speakerVolume)
  const setVolume = useUMPK80Store(s => s.setSpeakerVolume)

  useEffect(() => {
    (async () => {
      const res = await umpkGetVolume()
      await setVolume(res)
    })()
  }, [setVolume])

  return (
    <UmpkIconPanel icon={<Volume2 />}>
      <Slider step={0.01} max={0.50} onValueChange={([v]) => setVolume(v)} value={[volume]} />
    </UmpkIconPanel>
  )
}