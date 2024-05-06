import { Button } from '@/components/ui/Button'
import {
  BetweenHorizonalStart,
  BookText,
  Layers,
  Settings,
} from 'lucide-react'
import { DialogTrigger } from '@/components/ui/Dialog'

export default function SideMenu() {
  return (
    <div className="flex flex-col w-12 h-full bg-card justify-between items-center py-2 border-r">
      <div className="flex flex-col gap-2">
        <Button className="text-neutral-600" size="icon" variant="ghost">
          <BetweenHorizonalStart />
        </Button>
        <Button className="text-neutral-600" size="icon" variant="ghost">
          <Layers />
        </Button>
        <Button className="text-neutral-600" size="icon" variant="ghost">
          <BookText />
        </Button>
      </div>

      <div className="flex flex-col">
        <DialogTrigger asChild>
          <Button className="text-neutral-600" size="icon" variant="ghost">
            <Settings />
          </Button>
        </DialogTrigger>
      </div>
    </div>
  )
}
