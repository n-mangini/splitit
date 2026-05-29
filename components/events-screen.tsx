'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Plus, ReceiptText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEventIcon } from '@/lib/event-icons'
import { cn } from '@/lib/utils'
import type { Event } from '@/lib/types'

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

function IconCircle({
  children,
  tone = 'green',
  className,
}: {
  children: ReactNode
  tone?: 'green' | 'purple' | 'blue'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]',
        tone === 'green' && 'bg-[#E8FAF5] text-primary',
        tone === 'purple' && 'bg-[#F0E9FF] text-secondary',
        tone === 'blue' && 'bg-[#EAF4FF] text-[#2D9CDB]',
        className
      )}
    >
      {children}
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const { Icon } = getEventIcon(event.icon)

  return (
    <Link href={`/events/${event.id}`} className="splitit-card block p-4 transition-transform active:scale-[0.98]">
      <div className="flex items-center gap-4">
        <IconCircle tone={event.id === 'event-1' ? 'blue' : event.id === 'event-2' ? 'purple' : 'green'}>
          <Icon className="h-6 w-6" />
        </IconCircle>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-black text-foreground">{event.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{event.description}</p>
          <p className="mt-2 text-xs font-black text-primary">{event.participants.length} integrantes</p>
        </div>
      </div>
    </Link>
  )
}

function EmptyEventsCard() {
  return (
    <section className="splitit-card overflow-hidden p-5 sm:p-6">
      <div className="mx-auto max-w-sm text-center">
        <h2 className="text-2xl font-black tracking-normal text-foreground">Todavia no tenes eventos</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Crea tu primer evento o unite con un codigo para empezar a dividir gastos con tu grupo.
        </p>
      </div>
    </section>
  )
}

export function EventsScreen({ events }: { events: Event[] }) {
  const hasEvents = events.length > 0

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
            {hasEvents
              ? 'Selecciona un evento creado para cargar gastos, revisar saldos y ver quien le debe a quien.'
              : 'Cuando tengas eventos creados, los vas a ver aca para cargar gastos y revisar saldos.'}
          </p>
        </div>

        <Link href="/events/new">
          <Button className="h-12 w-full rounded-[18px] bg-primary px-5 font-black text-primary-foreground hover:bg-primary/90 lg:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Crear evento
          </Button>
        </Link>
      </header>

      {hasEvents && (
        <section>
          <div className="flex h-14 items-center gap-3 rounded-[20px] border border-border bg-card px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              className="h-full flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
              placeholder="Buscar evento"
            />
          </div>
        </section>
      )}

      {hasEvents ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      ) : (
        <EmptyEventsCard />
      )}
    </div>
  )
}
