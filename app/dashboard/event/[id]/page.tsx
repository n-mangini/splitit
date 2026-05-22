'use client'

import type { FormEvent, ReactNode } from 'react'
import { use, useState } from 'react'
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
  MoreVertical,
  Plane,
  Plus,
  ReceiptText,
  Search,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
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
import { Expense, ExpenseCategory } from '@/lib/types'

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

function ExpenseCard({ expense, paidBy }: { expense: Expense; paidBy?: string }) {
  return (
    <article className="splitit-card p-4">
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
          <p className="text-sm font-black text-primary">{formatCurrency(expense.amount)}</p>
          <ChevronRight className="ml-auto mt-2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </article>
  )
}

function BalanceSummaryCard({ suggestedPayments, totalToPay }: { suggestedPayments: number; totalToPay: number }) {
  return (
    <section className="splitit-card bg-[#E8FAF5] p-5">
      <div className="flex items-start gap-4">
        <IconCircle tone="green">
          <WalletCards className="h-6 w-6" />
        </IconCircle>
        <div className="flex-1">
          <h3 className="text-base font-black text-foreground">Quien le debe a quien</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Con las cuentas sugeridas, todos quedan en $0.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Cuentas sugeridas</p>
              <p className="text-xl font-black text-foreground">{suggestedPayments}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Monto a pagar</p>
              <p className="text-xl font-black text-primary">{formatCurrency(totalToPay)}</p>
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
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9FF] text-sm font-black text-secondary">
          {getInitials(from)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-foreground">{from}</p>
          <p className="text-xs font-semibold text-muted-foreground">debe pagar</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8FAF5] text-sm font-black text-primary">
          {getInitials(to)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-foreground">{to}</p>
          <p className="text-xs font-semibold text-muted-foreground">debe recibir</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-primary">{formatCurrency(amount)}</p>
          <ChevronRight className="ml-auto mt-2 h-5 w-5 text-muted-foreground" />
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
          'text-sm font-black',
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
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expensePaidBy, setExpensePaidBy] = useState(event.participants[0]?.id ?? '')
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food')
  const [splitBetween, setSplitBetween] = useState<string[]>(event.participants.map((participant) => participant.id))
  const [expenseError, setExpenseError] = useState('')
  const accessChanged = inviteAccess !== event.inviteAccess

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

    setExpenses((current) => [
      {
        id: `exp-local-${Date.now()}`,
        eventId: event.id,
        name: expenseName.trim(),
        amount,
        paidBy: expensePaidBy,
        splitBetween,
        date: new Date().toISOString().slice(0, 10),
        category: expenseCategory,
        createdAt: new Date().toISOString(),
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
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full bg-card">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <IconCircle tone="blue" size="lg">
              <Plane className="h-7 w-7" />
            </IconCircle>
            <div>
              <h1 className="text-2xl font-black text-foreground lg:text-4xl">{event.name}</h1>
              <p className="mt-1 max-w-xl text-sm font-semibold text-muted-foreground lg:text-base">
                {event.participants.length} integrantes · {expenses.length} gastos · {event.description}
              </p>
            </div>
          </div>
          <div className="hidden gap-3 lg:flex">
            <div className="rounded-[20px] bg-background px-5 py-3">
              <p className="text-xs font-bold text-muted-foreground">Total</p>
              <p className="text-lg font-black text-foreground">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="rounded-[20px] bg-background px-5 py-3">
              <p className="text-xs font-bold text-muted-foreground">Promedio</p>
              <p className="text-lg font-black text-foreground">{formatCurrency(averageExpense)}</p>
            </div>
          </div>
        </div>

        <TopTabs active={activeTab} onChange={setActiveTab} />
      </header>

      {activeTab === 'expenses' && (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-foreground lg:text-3xl">Gastos</h2>
                <p className="text-sm text-muted-foreground">{expenses.length} movimientos</p>
              </div>
              <Button variant="outline" className="h-10 rounded-[16px] border-border bg-card font-black">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
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

                    <div className="grid grid-cols-2 gap-3">
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

                return <ExpenseCard key={expense.id} expense={expense} paidBy={payer?.name} />
              })}
            </div>
          </div>

          <aside className="splitit-card grid grid-cols-2 gap-3 p-4 lg:sticky lg:top-28 lg:block lg:space-y-4 lg:p-5">
            <div className="lg:rounded-[20px] lg:bg-background lg:p-4">
              <p className="text-xs font-bold text-muted-foreground">Total de gastos</p>
              <p className="mt-1 text-xl font-black text-foreground">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="lg:rounded-[20px] lg:bg-background lg:p-4">
              <p className="text-xs font-bold text-muted-foreground">Gasto promedio</p>
              <p className="mt-1 text-xl font-black text-foreground">{formatCurrency(averageExpense)}</p>
            </div>
            <div className="hidden rounded-[20px] bg-[#F0E9FF] p-4 lg:block">
              <p className="text-xs font-bold text-secondary">Mas activo</p>
              <p className="mt-1 text-lg font-black text-foreground">
                {event.participants[0]?.name ?? 'Sin datos'}
              </p>
            </div>
          </aside>
        </section>
      )}

      {activeTab === 'balances' && (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-foreground lg:text-3xl">Saldos</h2>
                <p className="text-sm text-muted-foreground">Quien le debe a quien</p>
              </div>
              <Button variant="outline" className="h-10 rounded-[16px] border-border bg-card font-black">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Simplificar
              </Button>
            </div>

            <BalanceSummaryCard suggestedPayments={settlements.length} totalToPay={totalToPay} />

            <div className="space-y-3">
              <h3 className="text-base font-black text-foreground">Cuentas sugeridas</h3>
              {settlements.length > 0 ? (
                <div className="grid gap-3 xl:grid-cols-2">
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

          <aside className="splitit-card space-y-2 p-3 lg:sticky lg:top-28">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-foreground lg:text-3xl">Integrantes</h2>
              <p className="hidden text-sm text-muted-foreground lg:block">Personas incluidas en este grupo.</p>
            </div>
            <Button className="h-10 rounded-[16px] bg-primary font-black text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
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
    </div>
  )
}
