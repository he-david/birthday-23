import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const BASE =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 font-body text-base font-bold touch-manipulation transition-transform motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'

const VARIANTS = {
  primary: 'bg-wine text-paper',
  secondary: 'border border-gold bg-transparent text-wine',
} as const

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest} />
}
