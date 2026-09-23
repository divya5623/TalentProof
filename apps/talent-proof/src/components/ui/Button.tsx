import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

const styles: Record<Variant, string> = {
  primary:
    'bg-teal text-white hover:bg-teal-dark shadow-sm border border-transparent',
  secondary:
    'bg-white text-ink border border-border hover:border-border-strong hover:bg-surface-2',
  ghost: 'bg-transparent text-ink-muted hover:bg-white hover:text-ink border border-transparent',
  danger: 'bg-danger text-white hover:bg-red-700 border border-transparent',
  outline:
    'bg-transparent text-teal border border-teal/40 hover:bg-teal-light',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  to,
  children,
  className = '',
  size = 'md',
  onClick,
  ...rest
}: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 disabled:opacity-50 disabled:pointer-events-none ${styles[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link
        to={to}
        className={cls}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
