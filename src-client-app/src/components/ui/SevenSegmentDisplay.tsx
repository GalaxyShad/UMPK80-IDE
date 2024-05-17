import { bitsToBooleanList, cn } from '@/lib/utils.ts'

type DisplaySegmentProps = {
  value: number;
  className?: string;
};

export default function SevenSegmentDisplay({ value, className }: DisplaySegmentProps) {
  const displayStates = bitsToBooleanList(value)

  const segmentsPath = [
    '47.0,90.0 50.0,87.0 53.3,90.0 53.3,93.0 47.3,97.0 43.3,97.0 47.0,93.0',
    '4.8,46.2 9.8,49.3 39.5,49.3 44.5,46.2 39.5,43.2 9.8,43.2',
    '3,4.6 0,9.6 0,39.4 3,44.4 6.1,39.4 6.1,9.6',
    '3,48.1 0,53.1 0,82.8 3,87.8 6.1,82.8 6.1,53.1',
    '4.8,89.7 9.8,92.7 39.5,92.7 44.5,89.7 39.5,86.6 9.8,86.6',
    '46.3,48.1 49.3,53.1 49.3,82.8 46.3,87.8 43.2,82.8 43.2,53.1',
    '46.3,4.6 49.3,9.6 49.3,39.4 46.3,44.4 43.2,39.4 43.2,9.6',
    '4.8,3 9.8,6.1 39.5,6.1 44.5,3 39.5,0 9.8,0',
  ] as string[]

  return (
    <figure className={cn('min-w-4', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 53.3 97.7"
        preserveAspectRatio="xMidYMid meet"
      >
        {segmentsPath.map((s, i) =>
          <polygon
            key={i}
            points={s}
            className={cn(displayStates[i] ? 'fill-primary' : 'fill-primary/10')}
          />)}
      </svg>
    </figure>
  )
}
