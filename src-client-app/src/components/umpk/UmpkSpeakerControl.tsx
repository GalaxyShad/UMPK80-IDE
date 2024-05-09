import UmpkIconPanel from '@/components/umpk/UmpkIconPanel.tsx'
import { Volume2 } from 'lucide-react'
import { Slider } from '@/components/ui/Slider.tsx'

export default function UmpkSpeakerControl() {
  return (
    <UmpkIconPanel icon={<Volume2 />}>
      <Slider />
    </UmpkIconPanel>
  )
}