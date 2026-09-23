interface Props {
  initials: string
  hue?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  name?: string
}

const dim = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

export function Avatar({ initials, hue = 262, size = 'md', name }: Props) {
  return (
    <div
      title={name}
      className={`${dim[size]} flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-white`}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 42% 46%), hsl(${hue} 48% 34%))`,
      }}
    >
      {initials}
    </div>
  )
}
