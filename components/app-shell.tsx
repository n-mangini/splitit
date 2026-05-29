'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReceiptText, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/events', label: 'Eventos', icon: ReceiptText },
]

const mobileNavItems = [
  ...navItems,
  { href: '/profile', label: 'Perfil', icon: UserRound },
]

function Logo() {
  return (
    <Link href="/events" className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">
        S
      </div>
      <span className="text-2xl font-black tracking-normal text-foreground">SplitIt</span>
    </Link>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isEventsActive = pathname.startsWith('/events')

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <aside className="fixed bottom-6 left-6 top-6 z-40 hidden w-64 flex-col rounded-[32px] border border-border bg-card p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)] lg:flex">
        <Logo />

        <nav className="mt-10 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon

            return (
              <Link
                key={`${item.label}-desktop-${index}`}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-black transition-colors',
                  isEventsActive ? 'bg-[#E8FAF5] text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/profile"
          className={cn(
            'mt-auto flex items-center gap-3 rounded-[24px] bg-background p-4 transition-colors hover:bg-muted',
            pathname.startsWith('/profile') && 'bg-[#E8FAF5]'
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8FAF5] text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-foreground">Juan Perez</p>
            <p className="truncate text-xs font-semibold text-muted-foreground">Perfil</p>
          </div>
        </Link>
      </aside>

      <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-6 sm:max-w-2xl sm:px-8 md:max-w-4xl lg:max-w-none lg:pb-12 lg:pl-[344px] lg:pr-10 lg:pt-8">
        <div className="mx-auto w-full lg:max-w-7xl">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[88px] max-w-md rounded-t-[28px] border border-b-0 border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="grid h-full grid-cols-2 px-8">
          {mobileNavItems.map((item, index) => {
            const isActive = index === 0 ? isEventsActive : pathname.startsWith('/profile')
            const Icon = item.icon

            return (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
