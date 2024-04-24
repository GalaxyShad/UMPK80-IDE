import React from 'react'
import { Button } from './ui/button'
import { BetweenHorizonalStart, BetweenVerticalStart, BookText, Code, Layers, Settings } from 'lucide-react'
import { StackIcon } from '@radix-ui/react-icons'

type Props = {}

export default function SideMenu({}: Props) {
  return (
    <div className="flex flex-col w-12 h-full bg-card justify-between items-center py-2 border-r">
      <div className='flex flex-col gap-2'>
        <Button className='text-neutral-600' size="icon" variant="ghost"><BetweenHorizonalStart/></Button>
        <Button className='text-neutral-600' size="icon" variant="ghost"><Layers/></Button>
        <Button className='text-neutral-600' size="icon" variant="ghost"><BookText/></Button>
      </div>

      <div className='flex flex-col'>
        <Button className='text-neutral-600' size="icon" variant="ghost"><Settings/></Button>
      </div>
    </div>
  )
}