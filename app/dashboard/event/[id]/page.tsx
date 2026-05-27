'use client'

import type { FormEvent, ReactNode } from 'react'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  ChevronRight,
  Globe2,
  LockKeyhole,
  MailPlus,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Share2,
  ShoppingCart,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  calculateBalances,
  calculateSettlements,
  formatCurrency,
  formatDate,
  getInitials,
  getInviteLink,
  mockEvents,
} from '@/lib/mock-data'
import { getExchangeRates } from '@/lib/exchange'
import { EventIcon, eventIcons, getEventIcon } from '@/lib/event-icons'
import { Event, Expense, ExpenseCategory } from '@/lib/types'

const supportedCurrencies = ['ARS', 'USD', 'EUR', 'BRL', 'UYU', 'CLP'] as const

type TabValue = 'expenses' | 'balances' | 'members'

const tabs: { value: TabValue; label: string }[] = [
  { value: 'expenses', label: 'Gastos' },
  { value: 'balances', label: 'Saldos' },
  { value: 'members', label: 'Integrantes' },
]

const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Comida' },
  { value: 'transport', label: 'Transporte' },
  { value: 'accommodation', label: 'Alojamiento' },
  { value: 'entertainment', label: 'Actividades' },
  { value: 'shopping', label: 'Compras' },
  { value: 'utilities', label: 'Servicios' },
  { value: 'other', label: 'Otros' },
]

function IconCircle({
  children,
  tone = 'green',
  size = 'md',
}: {
  children: ReactNode
  tone?: 'green' | 'purple' | 'blue' | 'gray'
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-[18px]',
        size === 'sm' && 'h-10 w-10',
        size === 'md' && 'h-12 w-12',
        size === 'lg' && 'h-14 w-14 rounded-[20px]',
        tone === 'green' && 'bg-[#E8FAF5] text-primary',
        tone === 'purple' && 'bg-[#F0E9FF] text-secondary',
        tone === 'blue' && 'bg-[#EAF4FF] text-[#2D9CDB]',
        tone === 'gray' && 'bg-muted text-muted-foreground'
      )}
    >
      {children}
    </div>
  )
}

function TopTabs({ active, onChange }: { active: TabValue; onChange: (value: TabValue) => void }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
      <div className="flex min-w-max gap-5 border-b border-border lg:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative pb-3 text-sm font-black transition-colors',
              active === tab.value ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {tab.label}
            {active === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category?: Expense['category'] }) {
  const labelByCategory = {
    food: 'Alimentacion',
    transport: 'Transporte',
    accommodation: 'Alojamiento',
    entertainment: 'Actividades',
    shopping: 'Compras',
    utilities: 'Servicios',
    other: 'Otros',
  }

  const tone = category === 'entertainment' || category === 'shopping' ? 'green' : 'purple'

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-black',
        tone === 'green' ? 'bg-[#E8FAF5] text-primary' : 'bg-[#F0E9FF] text-secondary'
      )}
    >
      {labelByCategory[category ?? 'other']}
    </span>
  )
}

function expenseIcon(expense: Expense) {
  if (expense.category === 'food') return <ShoppingCart className="h-5 w-5" />
  if (expense.category === 'transport') return <CarFront className="h-5 w-5" />
  return <ReceiptText className="h-5 w-5" />
}

function ExpenseCard({
  expense,
  paidBy,
  currency,
  onSelect,
}: {
  expense: Expense
  paidBy?: string
  currency: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="splitit-card w-full p-4 text-left transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <IconCircle tone={expense.category === 'transport' ? 'purple' : 'green'} size="sm">
          {expenseIcon(expense)}
        </IconCircle>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-black text-foreground">{expense.name}</h3>
            <CategoryBadge category={expense.category} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(expense.date)}</p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Pago {paidBy ?? 'Sin asignar'} · Dividido entre {expense.splitBetween.length}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-black text-primary">{formatCurrency(expense.amount, currency)}</p>
          {expense.originalCurrency && expense.originalAmount !== undefined && (
            <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
              {formatCurrency(expense.originalAmount, expense.originalCurrency)} {expense.originalCurrency}
            </p>
          )}
          <ChevronRight className="ml-auto mt-2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  )
}

function BalanceSummaryCard({ suggestedPayments, totalToPay }: { suggestedPayments: number; totalToPay: number }) {
  return (
    <section className="splitit-card bg-[#E8FAF5] p-5">
      <div className="flex items-start gap-4">
        <IconCircle tone="green">
          <WalletCards className="h-6 w-6" />
        </IconCircle>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black text-foreground">Quien le debe a quien</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Con las cuentas sugeridas, todos quedan en $0.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">Cuentas sugeridas</p>
              <p className="truncate text-xl font-black text-foreground">{suggestedPayments}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">Monto a pagar</p>
              <p className="truncate text-xl font-black text-primary">{formatCurrency(totalToPay)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SuggestedPaymentCard({
  from,
  to,
  amount,
}: {
  from: string
  to: string
  amount: number
}) {
  return (
    <article className="splitit-card p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E9FF] text-xs font-black text-secondary sm:h-11 sm:w-11 sm:text-sm">
          {getInitials(from)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-foreground">{from}</p>
          <p className="hidden text-xs font-semibold text-muted-foreground sm:block">debe pagar</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8FAF5] text-xs font-black text-primary sm:h-11 sm:w-11 sm:text-sm">
          {getInitials(to)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-foreground">{to}</p>
          <p className="hidden text-xs font-semibold text-muted-foreground sm:block">debe recibir</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-black text-primary">{formatCurrency(amount)}</p>
          <ChevronRight className="ml-auto mt-2 hidden h-5 w-5 text-muted-foreground sm:block" />
        </div>
      </div>
    </article>
  )
}

function MemberBalanceRow({ name, amount }: { name: string; amount: number }) {
  const status = amount > 0 ? 'recibe' : amount < 0 ? 'debe' : 'en cero'

  return (
    <article className="flex items-center gap-3 rounded-[20px] bg-card p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-black text-foreground">
        {getInitials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-foreground">{name}</p>
        <span
          className={cn(
            'mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black',
            status === 'recibe' && 'bg-[#E8FAF5] text-primary',
            status === 'debe' && 'bg-[#F0E9FF] text-secondary',
            status === 'en cero' && 'bg-muted text-muted-foreground'
          )}
        >
          {status}
        </span>
      </div>
      <p
        className={cn(
          'shrink-0 text-sm font-black',
          amount > 0 && 'text-primary',
          amount < 0 && 'text-secondary',
          amount === 0 && 'text-foreground'
        )}
      >
        {amount > 0 ? '+' : ''}
        {formatCurrency(amount)}
      </p>
    </article>
  )
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const event = mockEvents.find((item) => item.id === resolvedParams.id) ?? mockEvents[0]
  const [expenses, setExpenses] = useState<Expense[]>(event.expenses)
  const [activeTab, setActiveTab] = useState<TabValue>('expenses')
  const [copied, setCopied] = useState(false)
  const [inviteAccess, setInviteAccess] = useState(event.inviteAccess)
  const [privateInvitees, setPrivateInvitees] = useState((event.privateInvitees ?? []).join(', '))
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  const [iconValue, setIconValue] = useState<EventIcon>(event.icon ?? 'plane')
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const { Icon: EventIconComponent } = getEventIcon(iconValue)
  const [eventDescription, setEventDescription] = useState(event.description ?? '')
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [descriptionDraft, setDescriptionDraft] = useState(eventDescription)
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCurrency, setExpenseCurrency] = useState(event.currency)
  const [expensePaidBy, setExpensePaidBy] = useState(event.participants[0]?.id ?? '')
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food')
  const [splitBetween, setSplitBetween] = useState<string[]>(event.participants.map((participant) => participant.id))
  const [expenseError, setExpenseError] = useState('')
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState('')
  const accessChanged = inviteAccess !== event.inviteAccess
  const needsConversion = expenseCurrency !== event.currency
  const amountNumber = Number(expenseAmount)
  const isValidAmount = Number.isFinite(amountNumber) && amountNumber > 0
  const conversionRate =
    needsConversion && rates && rates[expenseCurrency] && rates[event.currency]
      ? rates[event.currency] / rates[expenseCurrency]
      : null
  const convertedAmount =
    needsConversion && isValidAmount && conversionRate ? amountNumber * conversionRate : null

  useEffect(() => {
    if (!isAddExpenseOpen || !needsConversion || rates) return
    let cancelled = false
    setRatesLoading(true)
    setRatesError('')
    getExchangeRates()
      .then((fetched) => {
        if (!cancelled) setRates(fetched)
      })
      .catch((error: Error) => {
        if (!cancelled) setRatesError(error.message)
      })
      .finally(() => {
        if (!cancelled) setRatesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isAddExpenseOpen, needsConversion, rates])

  const eventSnapshot = { ...event, expenses }
  const balances = calculateBalances(eventSnapshot)
  const settlements = calculateSettlements(balances)
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0)
  const averageExpense = totalExpenses / event.participants.length
  const totalToPay = settlements.reduce((acc, settlement) => acc + settlement.amount, 0)
  const inviteLink = getInviteLink(event.inviteCode, inviteAccess)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const toggleSplitParticipant = (participantId: string) => {
    setSplitBetween((current) =>
      current.includes(participantId)
        ? current.filter((id) => id !== participantId)
        : [...current, participantId]
    )
  }

  const resetExpenseForm = () => {
    setExpenseName('')
    setExpenseAmount('')
    setExpenseCurrency(event.currency)
    setExpensePaidBy(event.participants[0]?.id ?? '')
    setExpenseCategory('food')
    setSplitBetween(event.participants.map((participant) => participant.id))
    setExpenseError('')
  }

  const handleAddExpense = (formEvent: FormEvent) => {
    formEvent.preventDefault()
    setExpenseError('')

    const amount = Number(expenseAmount)

    if (!expenseName.trim()) {
      setExpenseError('Ingresa un nombre para el gasto')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setExpenseError('Ingresa un monto valido')
      return
    }

    if (!expensePaidBy) {
      setExpenseError('Selecciona quien pago')
      return
    }

    if (splitBetween.length === 0) {
      setExpenseError('Selecciona al menos una persona para dividir')
      return
    }

    let storedAmount = amount
    let originalAmount: number | undefined
    let originalCurrency: string | undefined
    let exchangeRate: number | undefined

    if (needsConversion) {
      if (ratesLoading) {
        setExpenseError('Esperando el tipo de cambio...')
        return
      }
      if (!rates || !conversionRate) {
        setExpenseError(ratesError || 'No se pudo obtener el tipo de cambio')
        return
      }
      storedAmount = Math.round(amount * conversionRate * 100) / 100
      originalAmount = amount
      originalCurrency = expenseCurrency
      exchangeRate = conversionRate
    }

    setExpenses((current) => [
      {
        id: `exp-local-${Date.now()}`,
        eventId: event.id,
        name: expenseName.trim(),
        amount: storedAmount,
        paidBy: expensePaidBy,
        splitBetween,
        date: new Date().toISOString().slice(0, 10),
        category: expenseCategory,
        createdAt: new Date().toISOString(),
        originalAmount,
        originalCurrency,
        exchangeRate,
      },
      ...current,
    ])
    resetExpenseForm()
    setIsAddExpenseOpen(false)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="space-y-5 lg:rounded-[32px] lg:border lg:border-border lg:bg-card lg:p-6 lg:shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-foreground shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-11 rounded-[18px] bg-primary px-4 font-black text-primary-foreground hover:bg-primary/90">
                  <Share2 className="mr-2 h-4 w-4" />
                  Invitar
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[24px]">
                <DialogHeader>
                  <DialogTitle>Invitar al grupo</DialogTitle>
                  <DialogDescription>
                    Comparte el link y elegi si cualquiera puede entrar o solo usuarios registrados.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 rounded-[22px] bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setInviteAccess('public')}
                      className={cn(
                        'flex min-h-20 flex-col items-start rounded-[18px] px-3 py-3 text-left transition-colors',
                        inviteAccess === 'public' ? 'bg-card text-primary shadow-[0_4px_16px_rgba(15,23,42,0.04)]' : 'text-muted-foreground'
                      )}
                    >
                      <Globe2 className="h-5 w-5" />
                      <span className="mt-2 rounded-full bg-[#E8FAF5] px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                        Recomendado
                      </span>
                      <span className="mt-2 text-sm font-black">Publico</span>
                      <span className="text-xs font-semibold">Cualquiera con link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteAccess('private')}
                      className={cn(
                        'flex min-h-20 flex-col items-start rounded-[18px] px-3 py-3 text-left transition-colors',
                        inviteAccess === 'private' ? 'bg-card text-secondary shadow-[0_4px_16px_rgba(15,23,42,0.04)]' : 'text-muted-foreground'
                      )}
                    >
                      <LockKeyhole className="h-5 w-5" />
                      <span className="mt-2 text-sm font-black">Privado</span>
                      <span className="text-xs font-semibold">Solo registrados</span>
                    </button>
                  </div>
                  <div className="rounded-[20px] border border-border bg-background p-3 text-sm font-semibold text-muted-foreground">
                    {inviteAccess === 'public'
                      ? 'Con link publico, cada invitado elige su nombre desde la lista de participantes.'
                      : 'Con link privado, solo pueden unirse las personas que agregues por email o username.'}
                  </div>
                  {inviteAccess === 'private' && (
                    <div className="space-y-2">
                      <label className="text-sm font-black text-foreground" htmlFor="private-invitees">
                        Invitados permitidos
                      </label>
                      <div className="relative">
                        <MailPlus className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Textarea
                          id="private-invitees"
                          value={privateInvitees}
                          onChange={(item) => setPrivateInvitees(item.target.value)}
                          placeholder="mail@ejemplo.com, @usuario"
                          className="min-h-24 rounded-[18px] pl-10"
                        />
                      </div>
                      <p className="text-xs font-semibold leading-5 text-muted-foreground">
                        En produccion, esta lista se valida en backend antes de asociar el usuario al evento.
                      </p>
                    </div>
                  )}
                  {accessChanged && (
                    <p className="text-xs font-semibold leading-5 text-muted-foreground">
                      Este cambio deberia guardarse en backend como nueva politica de acceso del evento.
                    </p>
                  )}
                  <Input readOnly value={inviteLink} className="rounded-[18px]" />
                  <Button onClick={handleCopyLink} className="w-full rounded-[18px]">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                    {copied ? 'Copiado' : 'Copiar link'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="group relative"
              aria-label="Cambiar icono del evento"
            >
              <IconCircle tone="blue" size="lg">
                <EventIconComponent className="h-7 w-7" />
              </IconCircle>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-transform group-hover:scale-110">
                <Pencil className="h-3 w-3" />
              </span>
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground lg:text-4xl">{event.name}</h1>
              <p className="mt-1 max-w-xl text-sm font-semibold text-muted-foreground lg:text-base">
                {event.participants.length} integrantes · {expenses.length} gastos
                {eventDescription && ` · ${eventDescription}`}
                <button
                  type="button"
                  onClick={() => {
                    setDescriptionDraft(eventDescription)
                    setIsDescriptionOpen(true)
                  }}
                  className="ml-2 inline-flex items-center gap-1 align-middle text-xs font-black text-primary hover:underline"
                >
                  <Pencil className="h-3 w-3" />
                  {eventDescription ? 'Editar descripcion' : 'Agregar descripcion'}
                </button>
              </p>
            </div>
          </div>
        </div>

        <TopTabs active={activeTab} onChange={setActiveTab} />
      </header>

      {activeTab === 'expenses' && (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <aside className="splitit-card grid grid-cols-2 gap-3 p-4 lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:block lg:space-y-4 lg:p-5">
            <div className="lg:rounded-[20px] lg:bg-background lg:p-4">
              <p className="text-xs font-bold text-muted-foreground">Total de gastos</p>
              <p className="mt-1 text-xl font-black text-foreground">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="lg:rounded-[20px] lg:bg-background lg:p-4">
              <p className="text-xs font-bold text-muted-foreground">Gasto promedio</p>
              <p className="mt-1 text-xl font-black text-foreground">{formatCurrency(averageExpense)}</p>
            </div>
          </aside>

          <div className="space-y-4 lg:col-start-1 lg:row-start-1">
            <div>
              <h2 className="text-2xl font-black text-foreground lg:text-3xl">Gastos</h2>
              <p className="text-sm text-muted-foreground">{expenses.length} movimientos</p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="flex h-14 items-center gap-3 rounded-[20px] border border-border bg-card px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  className="h-full flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar gasto"
                />
              </div>

              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="h-14 w-full rounded-[18px] bg-primary text-base font-black text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-5 w-5" />
                    Agregar gasto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[24px]">
                  <DialogHeader>
                    <DialogTitle>Agregar gasto</DialogTitle>
                    <DialogDescription>
                      Carga quien pago, el monto y entre quienes se divide.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="expense-name">Nombre</Label>
                      <Input
                        id="expense-name"
                        value={expenseName}
                        onChange={(item) => setExpenseName(item.target.value)}
                        placeholder="Ej: Supermercado"
                        className="rounded-[18px]"
                      />
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="expense-amount">Monto</Label>
                        <Input
                          id="expense-amount"
                          inputMode="decimal"
                          value={expenseAmount}
                          onChange={(item) => setExpenseAmount(item.target.value)}
                          placeholder="0"
                          className="rounded-[18px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Moneda</Label>
                        <Select value={expenseCurrency} onValueChange={setExpenseCurrency}>
                          <SelectTrigger className="h-10 w-[110px] rounded-[18px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {supportedCurrencies.map((code) => (
                              <SelectItem key={code} value={code}>
                                {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {needsConversion && (
                      <div className="rounded-[16px] border border-border bg-background px-3 py-2 text-xs font-semibold">
                        {ratesLoading && (
                          <span className="text-muted-foreground">Obteniendo tipo de cambio...</span>
                        )}
                        {!ratesLoading && ratesError && (
                          <span className="text-destructive">{ratesError}</span>
                        )}
                        {!ratesLoading && !ratesError && conversionRate && (
                          <div className="flex flex-col gap-0.5 text-muted-foreground">
                            <span>
                              1 {expenseCurrency} = {conversionRate.toLocaleString('es-AR', { maximumFractionDigits: 4 })} {event.currency}
                            </span>
                            {convertedAmount !== null && (
                              <span className="text-foreground">
                                Se guardara como {formatCurrency(convertedAmount, event.currency)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select value={expenseCategory} onValueChange={(value) => setExpenseCategory(value as ExpenseCategory)}>
                        <SelectTrigger className="h-10 rounded-[18px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Pago</Label>
                      <Select value={expensePaidBy} onValueChange={setExpensePaidBy}>
                        <SelectTrigger className="h-11 rounded-[18px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {event.participants.map((participant) => (
                            <SelectItem key={participant.id} value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Dividir entre</Label>
                        <span className="text-xs font-semibold text-muted-foreground">{splitBetween.length} seleccionados</span>
                      </div>
                      <div className="grid gap-2">
                        {event.participants.map((participant) => {
                          const checked = splitBetween.includes(participant.id)

                          return (
                            <label
                              key={participant.id}
                              className="flex cursor-pointer items-center gap-3 rounded-[18px] border border-border bg-background px-3 py-2"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleSplitParticipant(participant.id)}
                                className="h-4 w-4 accent-primary"
                              />
                              <span className="text-sm font-bold text-foreground">{participant.name}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {expenseError && (
                      <p className="text-sm font-semibold text-destructive">{expenseError}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-[18px]"
                        onClick={() => {
                          resetExpenseForm()
                          setIsAddExpenseOpen(false)
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="rounded-[18px]">
                        Guardar gasto
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {expenses.map((expense) => {
                const payer = event.participants.find((participant) => participant.id === expense.paidBy)

                return (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    paidBy={payer?.name}
                    currency={event.currency}
                    onSelect={() => setSelectedExpenseId(expense.id)}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'balances' && (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-foreground lg:text-3xl">Saldos</h2>
              <p className="truncate text-sm text-muted-foreground">Quien le debe a quien</p>
            </div>

            <BalanceSummaryCard suggestedPayments={settlements.length} totalToPay={totalToPay} />

            <div className="space-y-3">
              <h3 className="text-base font-black text-foreground">Cuentas sugeridas</h3>
              {settlements.length > 0 ? (
                <div className="grid gap-3 xl:grid-cols-2 [&>*]:min-w-0">
                  {settlements.map((settlement) => (
                    <SuggestedPaymentCard
                      key={`${settlement.from}-${settlement.to}-${settlement.amount}`}
                      from={settlement.fromName}
                      to={settlement.toName}
                      amount={settlement.amount}
                    />
                  ))}
                </div>
              ) : (
                <div className="splitit-card p-6 text-center">
                  <Check className="mx-auto h-9 w-9 text-primary" />
                  <p className="mt-3 font-black text-foreground">Esta todo claro</p>
                  <p className="text-sm text-muted-foreground">No hay pagos pendientes.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="splitit-card min-w-0 space-y-2 p-3 lg:sticky lg:top-28">
            <h3 className="px-1 pb-1 text-base font-black text-foreground">Saldo por integrante</h3>
            {balances.map((balance) => (
              <MemberBalanceRow
                key={balance.participantId}
                name={balance.participantName}
                amount={balance.netBalance}
              />
            ))}
          </aside>
        </section>
      )}

      {activeTab === 'members' && (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-foreground lg:text-3xl">Integrantes</h2>
            <p className="hidden text-sm text-muted-foreground lg:block">Personas incluidas en este grupo.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {event.participants.map((participant) => (
              <article key={participant.id} className="splitit-card flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8FAF5] text-sm font-black text-primary">
                  {getInitials(participant.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-foreground">{participant.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {participant.isGuest ? 'Invitado' : participant.email}
                  </p>
                </div>
                <UsersRound className="h-5 w-5 text-muted-foreground" />
              </article>
            ))}
          </div>
        </section>
      )}

      <ExpenseDetailDialog
        expense={expenses.find((item) => item.id === selectedExpenseId) ?? null}
        participants={event.participants}
        currency={event.currency}
        onClose={() => setSelectedExpenseId(null)}
      />

      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="rounded-[24px]">
          <DialogHeader>
            <DialogTitle>{eventDescription ? 'Editar descripcion' : 'Agregar descripcion'}</DialogTitle>
            <DialogDescription>Aparece debajo del nombre del evento.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(item) => {
              item.preventDefault()
              const trimmed = descriptionDraft.trim()
              setEventDescription(trimmed)
              event.description = trimmed || undefined
              setIsDescriptionOpen(false)
            }}
            className="space-y-4"
          >
            <Textarea
              value={descriptionDraft}
              onChange={(item) => setDescriptionDraft(item.target.value)}
              placeholder="Una descripcion corta del evento"
              className="min-h-24 rounded-[18px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-[18px]"
                onClick={() => setIsDescriptionOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-[18px]">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
        <DialogContent className="rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Elegi un icono</DialogTitle>
            <DialogDescription>
              Lo vas a ver en el header del evento y en la lista de tus eventos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3">
            {eventIcons.map(({ value, label, Icon }) => {
              const isSelected = value === iconValue

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setIconValue(value)
                    event.icon = value
                    setIsIconPickerOpen(false)
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-[18px] border p-3 transition-colors',
                    isSelected
                      ? 'border-primary bg-[#E8FAF5] text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/40'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-black">{label}</span>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ExpenseDetailDialog({
  expense,
  participants,
  currency,
  onClose,
}: {
  expense: Expense | null
  participants: Event['participants']
  currency: string
  onClose: () => void
}) {
  const payer = expense ? participants.find((participant) => participant.id === expense.paidBy) : undefined
  const sharePerPerson = expense ? expense.amount / expense.splitBetween.length : 0
  const splitParticipants = expense
    ? expense.splitBetween
        .map((id) => participants.find((participant) => participant.id === id))
        .filter((participant): participant is NonNullable<typeof participant> => Boolean(participant))
    : []

  return (
    <Dialog open={expense !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[24px]">
        {expense && (
          <>
            <DialogHeader>
              <DialogTitle>{expense.name}</DialogTitle>
              <DialogDescription>{formatDate(expense.date)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-[20px] bg-[#E8FAF5] p-4">
                <p className="text-xs font-bold text-muted-foreground">Total</p>
                <p className="mt-1 text-2xl font-black text-primary">
                  {formatCurrency(expense.amount, currency)}
                </p>
                {expense.originalCurrency && expense.originalAmount !== undefined && expense.exchangeRate && (
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Original: {formatCurrency(expense.originalAmount, expense.originalCurrency)} {expense.originalCurrency}
                    {' · '}
                    1 {expense.originalCurrency} = {expense.exchangeRate.toLocaleString('es-AR', { maximumFractionDigits: 4 })} {currency}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-border bg-background p-3">
                  <p className="text-xs font-bold text-muted-foreground">Pago</p>
                  <p className="mt-1 text-sm font-black text-foreground">{payer?.name ?? 'Sin asignar'}</p>
                </div>
                <div className="rounded-[18px] border border-border bg-background p-3">
                  <p className="text-xs font-bold text-muted-foreground">Categoria</p>
                  <p className="mt-1 text-sm font-black text-foreground">
                    <CategoryBadge category={expense.category} />
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-foreground">Dividido entre</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {formatCurrency(sharePerPerson, currency)} c/u
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {splitParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 rounded-[18px] border border-border bg-background p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-black text-foreground">
                        {getInitials(participant.name)}
                      </div>
                      <p className="flex-1 text-sm font-bold text-foreground">{participant.name}</p>
                      <p className="text-sm font-black text-primary">
                        {formatCurrency(sharePerPerson, currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
