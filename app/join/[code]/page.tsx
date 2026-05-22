'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Users, ArrowRight } from 'lucide-react'
import { mockEvents } from '@/lib/mock-data'

export default function JoinEventPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Find event by invite code
  const event = mockEvents.find(e => e.inviteCode === resolvedParams.code)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Por favor ingresa tu nombre')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to event page
    if (event) {
      router.push(`/dashboard/event/${event.id}`)
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">?</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Evento no encontrado</h2>
            <p className="text-muted-foreground mb-6">
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-lg font-bold text-foreground">SplitIt</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{event.name.charAt(0)}</span>
              </div>
              <CardTitle className="text-2xl text-foreground">{event.name}</CardTitle>
              <CardDescription>
                {event.description || 'Te invitaron a dividir gastos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Event Info */}
              <div className="flex items-center justify-center gap-6 mb-6 py-4 border-y border-border">
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

              {/* Join Form */}
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tu nombre</Label>
                  <Input
                    id="name"
                    placeholder="Como te llamas?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este nombre veran los demas participantes
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
                      Unirme al evento
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Ya tienes cuenta?
                </p>
                <Link href="/login">
                  <Button variant="outline" className="gap-2">
                    Iniciar sesion
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
