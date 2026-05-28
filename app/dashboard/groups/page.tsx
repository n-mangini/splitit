'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus, Search } from 'lucide-react'

function Logo() {
  return (
    <Link href="/dashboard/groups" className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">
        S
      </div>
      <span className="text-2xl font-black tracking-normal text-foreground">SplitIt</span>
    </Link>
  )
}
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { calculateBalances, formatCurrency, mockEvents } from '@/lib/mock-data'
import { getEventIcon } from '@/lib/event-icons'

function IconCircle({
  children,
  tone = 'green',
}: {
  children: ReactNode
  tone?: 'green' | 'purple' | 'blue'
}) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]',
        tone === 'green' && 'bg-[#E8FAF5] text-primary',
        tone === 'purple' && 'bg-[#F0E9FF] text-secondary',
        tone === 'blue' && 'bg-[#EAF4FF] text-[#2D9CDB]'
      )}
    >
      {children}
    </div>
  )
}

function GroupCard({ event }: { event: (typeof mockEvents)[number] }) {
  const balances = calculateBalances(event)
  const userBalance = balances.find((balance) => balance.participantId === 'p-1')?.netBalance ?? 0
  const isPositive = userBalance > 0
  const isNegative = userBalance < 0
  const balanceLabel = isPositive ? 'te deben' : isNegative ? 'debes' : 'esta todo claro'
  const { Icon } = getEventIcon(event.icon)

  return (
    <Link href={`/dashboard/event/${event.id}`} className="splitit-card block p-4 transition-transform active:scale-[0.98]">
      <div className="flex items-center gap-4">
        <IconCircle tone={event.id === 'event-1' ? 'blue' : event.id === 'event-2' ? 'purple' : 'green'}>
          <Icon className="h-6 w-6" />
        </IconCircle>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-black text-foreground">{event.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.participants.length} integrantes · {event.expenses.length} gastos
          </p>
        </div>

        <div className="text-right">
          <p
            className={cn(
              'text-base font-black',
              isPositive && 'text-primary',
              isNegative && 'text-secondary',
              !userBalance && 'text-foreground'
            )}
          >
            {userBalance !== 0 ? formatCurrency(Math.abs(userBalance)) : '$0'}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">{balanceLabel}</p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  )
}

export default function GroupsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex items-center justify-between lg:hidden">
        <Logo />
      </header>

      <header className="space-y-4 lg:flex lg:items-end lg:justify-between lg:space-y-0">
        <div>
          <p className="text-sm font-black text-primary">Eventos</p>
          <h1 className="mt-1 text-3xl font-black text-foreground lg:text-5xl">Tus eventos</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground lg:text-base">
            Selecciona un evento creado para cargar gastos, revisar saldos y ver quien le debe a quien.
          </p>
        </div>

        <Link href="/dashboard/new">
          <Button className="h-12 w-full rounded-[18px] bg-primary px-5 font-black text-primary-foreground hover:bg-primary/90 lg:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Crear evento
          </Button>
        </Link>
      </header>

      <section>
        <div className="flex h-14 items-center gap-3 rounded-[20px] border border-border bg-card px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            className="h-full flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            placeholder="Buscar evento"
          />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {mockEvents.map((event) => (
          <GroupCard key={event.id} event={event} />
        ))}
      </section>
    </div>
  )
}
