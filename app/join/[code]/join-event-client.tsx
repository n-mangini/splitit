'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, LockKeyhole, UserRoundCheck, Users } from 'lucide-react'
import { mockEvents } from '@/lib/mock-data'

type StoredClaim = {
  eventId: string
  participantId: string
  token: string
  userId?: string
  userEmail?: string
  claimedAt: string
}

type StoredClaims = Record<string, StoredClaim>

const CLAIMS_STORAGE_KEY = 'splitit:participant-claims'
const MOCK_AUTH_USER = {
  id: 'user-1',
  email: 'juan@email.com',
}

function createToken() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function readStoredClaims(): StoredClaims {
  try {
    const rawClaims = localStorage.getItem(CLAIMS_STORAGE_KEY)
    return rawClaims ? JSON.parse(rawClaims) : {}
  } catch {
    return {}
  }
}

function getClaimKey(eventId: string, participantId: string) {
  return `${eventId}:${participantId}`
}

export function JoinEventClient({
  code,
  accessParam,
}: {
  code: string
  accessParam?: string
}) {
  const router = useRouter()
  const [participantId, setParticipantId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [storedClaims, setStoredClaims] = useState<StoredClaims>({})
  const [currentClaim, setCurrentClaim] = useState<StoredClaim | null>(null)
  const [continuesAsGuest, setContinuesAsGuest] = useState(false)
  const [continuesWithAccount, setContinuesWithAccount] = useState(false)

  const event = mockEvents.find((item) => item.inviteCode === code)
  const inviteAccess = accessParam === 'private' || accessParam === 'public'
    ? accessParam
    : event?.inviteAccess
  const currentParticipant = event?.participants.find((participant) => participant.id === currentClaim?.participantId)
  const shouldShowParticipantForm = !!currentClaim || continuesAsGuest || continuesWithAccount
  const availableParticipants = useMemo(() => {
    if (!event) return []

    return event.participants.filter((participant) => {
      const claim = storedClaims[getClaimKey(event.id, participant.id)]
      return !claim || claim.token === currentClaim?.token
    })
  }, [currentClaim?.token, event, storedClaims])

  useEffect(() => {
    if (!event || inviteAccess !== 'public') return

    const claims = readStoredClaims()
    const existingClaim = Object.values(claims).find((claim) => claim.eventId === event.id) ?? null

    setStoredClaims(claims)
    setCurrentClaim(existingClaim)
    setParticipantId(existingClaim?.participantId ?? '')
  }, [event, inviteAccess])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!event) return

    if (inviteAccess === 'private') {
      router.push('/login')
      return
    }

    if (!participantId) {
      setError('Por favor selecciona tu nombre en la lista')
      return
    }

    const claims = readStoredClaims()
    const claimKey = getClaimKey(event.id, participantId)
    const existingClaim = claims[claimKey]

    if (existingClaim && existingClaim.token !== currentClaim?.token) {
      setError('Ese nombre ya fue elegido desde este navegador')
      setStoredClaims(claims)
      return
    }

    const claim = existingClaim ?? {
      eventId: event.id,
      participantId,
      token: currentClaim?.token ?? createToken(),
      ...(continuesWithAccount ? MOCK_AUTH_USER : {}),
      claimedAt: new Date().toISOString(),
    }

    setIsLoading(true)
    claims[claimKey] = claim
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims))
    setStoredClaims(claims)
    setCurrentClaim(claim)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/dashboard/event/${event.id}`)
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-3xl">?</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Evento no encontrado</h2>
            <p className="mb-6 text-muted-foreground">
              El codigo de invitacion no es valido o el evento ya no existe
            </p>
            <Link href="/">
              <Button>Ir al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-lg font-bold text-foreground">SplitIt</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-2xl font-bold text-primary">{event.name.charAt(0)}</span>
              </div>
              <CardTitle className="text-2xl text-foreground">{event.name}</CardTitle>
              <CardDescription>
                {event.description || 'Te invitaron a dividir gastos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-center gap-6 border-y border-border py-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{event.participants.length}</p>
                  <p className="text-xs text-muted-foreground">Participantes</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{event.expenses.length}</p>
                  <p className="text-xs text-muted-foreground">Gastos</p>
                </div>
              </div>

              {inviteAccess === 'public' ? (
                <form onSubmit={handleJoin} className="space-y-4">
                  {currentParticipant && (
                    <div className="rounded-[20px] border border-[#E8FAF5] bg-[#E8FAF5] p-4">
                      <p className="text-sm font-black text-primary">Ya estas asociado</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        Este navegador esta vinculado a {currentParticipant.name}.
                      </p>
                    </div>
                  )}

                  {!shouldShowParticipantForm ? (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        className="w-full gap-2"
                        onClick={() => setContinuesAsGuest(true)}
                      >
                        <Users className="h-4 w-4" />
                        Continuar sin cuenta
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setContinuesWithAccount(true)}
                      >
                        <UserRoundCheck className="h-4 w-4" />
                        Continuar con mi cuenta
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="participant">Quien sos?</Label>
                        <Select value={participantId} onValueChange={setParticipantId} disabled={!!currentClaim}>
                          <SelectTrigger id="participant" className="h-12 w-full rounded-[18px] bg-input">
                        <SelectValue placeholder="Elegite de la lista" />
                      </SelectTrigger>
                          <SelectContent>
                            {availableParticipants.map((participant) => (
                              <SelectItem key={participant.id} value={participant.id}>
                                {participant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {currentClaim
                            ? currentClaim.userId
                              ? `Este nombre quedo vinculado a ${currentClaim.userEmail}.`
                              : 'La asociacion queda guardada con un token local en este navegador.'
                            : continuesWithAccount
                              ? 'Este nombre quedara vinculado a tu cuenta para que el evento se guarde en tu perfil.'
                              : 'Al continuar sin cuenta, elegis un nombre ya cargado en el evento.'}
                        </p>
                      </div>

                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}

                      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                        {isLoading ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <>
                            <Users className="h-4 w-4" />
                            {currentClaim ? 'Continuar al evento' : 'Unirme al evento'}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-border bg-muted/40 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#F0E9FF] text-secondary">
                      <LockKeyhole className="h-6 w-6" />
                    </div>
                    <h2 className="mt-3 text-base font-bold text-foreground">Invitacion privada</h2>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      Solo pueden unirse usuarios registrados que esten en la lista de invitados del organizador.
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[#F0E9FF] bg-[#F0E9FF] p-4">
                    <p className="text-sm font-black text-secondary">Acceso restringido</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
                      Inicia sesion con el email o username invitado. Si no estas en la lista, pedi acceso al creador del evento.
                    </p>
                  </div>
                  <Link href="/login" className="block">
                    <Button className="w-full gap-2">
                      <UserRoundCheck className="h-4 w-4" />
                      Iniciar sesion
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      Crear cuenta
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
