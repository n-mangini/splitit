'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Plus, UserRound, UsersRound, WalletCards } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
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

function ActionCard({
  title,
  description,
  tone,
  href,
  icon,
}: {
  title: string
  description: string
  tone: 'green' | 'blue'
  href: string
  icon: ReactNode
}) {
  return (
    <Link href={href} className="splitit-card block p-4 transition-transform active:scale-[0.98]">
      <IconCircle tone={tone}>{icon}</IconCircle>
      <h2 className="mt-4 text-base font-black text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-7 lg:space-y-10">
      <header className="flex items-center justify-between lg:hidden">
        <Logo />
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <UserRound className="h-5 w-5 text-foreground" />
        </Button>
      </header>

      <section className="relative overflow-hidden rounded-[32px] bg-[#E8FAF5] p-6 sm:p-8 lg:min-h-[300px] lg:p-10">
        <div className="max-w-[230px] sm:max-w-lg">
          <p className="text-3xl font-black leading-tight text-foreground sm:text-4xl lg:max-w-xl lg:text-5xl">
            Gastos compartidos, sin complicaciones.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            Crea tu evento, agrega gastos y SplitIt se encarga del resto.
          </p>
        </div>

        <div className="absolute bottom-5 right-5 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-[0_8px_24px_rgba(33,184,148,0.18)] sm:h-32 sm:w-32 lg:bottom-8 lg:right-10 lg:h-36 lg:w-36">
          <WalletCards className="h-11 w-11 text-primary sm:h-14 sm:w-14" />
        </div>
      </section>

      <section className="mx-auto grid w-full grid-cols-2 gap-4 lg:max-w-3xl">
        <ActionCard
          title="Crear evento"
          description="Inicia un nuevo evento y empeza a dividir gastos."
          tone="green"
          href="/dashboard/new"
          icon={<UsersRound className="h-6 w-6" />}
        />
        <ActionCard
          title="Unirme a un evento"
          description="Ingresa el codigo de un evento existente."
          tone="blue"
          href="/join/demo"
          icon={<Plus className="h-6 w-6" />}
        />
      </section>

    </div>
  )
}
