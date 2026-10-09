import type { ReactNode } from 'react'

/** Single-column layout wrapper with safe-area padding. */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main
      className={`mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] ${className}`}
    >
      {children}
    </main>
  )
}
