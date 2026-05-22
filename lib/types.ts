// Types for SplitIt
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Participant {
  id: string
  name: string
  email?: string
  avatar?: string
  isGuest: boolean
}

export interface Expense {
  id: string
  eventId: string
  name: string
  amount: number
  paidBy: string // participant id
  splitBetween: string[] // participant ids
  date: string
  category?: ExpenseCategory
  createdAt: string
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'other'

export interface Event {
  id: string
  name: string
  description?: string
  createdBy: string
  participants: Participant[]
  expenses: Expense[]
  createdAt: string
  inviteCode: string
  inviteAccess: 'public' | 'private'
  privateInvitees?: string[]
  currency: string
}

export interface Balance {
  participantId: string
  participantName: string
  totalPaid: number
  totalOwed: number
  netBalance: number // positive = owed money, negative = owes money
}

export interface Settlement {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
  settled: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
