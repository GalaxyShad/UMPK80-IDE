import { ReactElement, ReactNode } from 'react'
import { LucideProps } from 'lucide-react'

interface UmpkIconPanelProps {
  icon: ReactElement<LucideProps>,
  children: ReactNode
}

export default function UmpkIconPanel({ icon, children }: UmpkIconPanelProps) {
  const Icon = icon

  return (
    <div className="bg-accent/50 flex flex-row gap-2 font-semibold rounded px-2 py-1 min-h-[36px] items-center">
      <Icon.type className="text-neutral-700" size={24} {...Icon.props} />
      <div className="flex flex-row w-full justify-end">
        {children}
      </div>
    </div>
  )
}