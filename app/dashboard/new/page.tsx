'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Globe2, LockKeyhole, MailPlus, UserRoundPlus, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type InviteAccess = 'public' | 'private'

export default function NewEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [inviteAccess, setInviteAccess] = useState<InviteAccess>('public')
  const [publicParticipantNames, setPublicParticipantNames] = useState<string[]>([''])
  const [privateInvitees, setPrivateInvitees] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const addPublicParticipantName = () => {
    setPublicParticipantNames([...publicParticipantNames, ''])
  }

  const removePublicParticipantName = (index: number) => {
    if (publicParticipantNames.length > 1) {
      setPublicParticipantNames(publicParticipantNames.filter((_, i) => i !== index))
    }
  }

  const updatePublicParticipantName = (index: number, value: string) => {
    const updated = [...publicParticipantNames]
    updated[index] = value
    setPublicParticipantNames(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('El nombre del evento es requerido')
      return
    }

    const validPublicNames = publicParticipantNames.filter((participant) => participant.trim())
    const validPrivateInvitees = privateInvitees
      .split(/[,\n]/)
      .map((invitee) => invitee.trim())
      .filter(Boolean)

    if (inviteAccess === 'public' && validPublicNames.length === 0) {
      setError('Agrega al menos un nombre disponible para el link publico')
      return
    }

    if (inviteAccess === 'private' && validPrivateInvitees.length === 0) {
      setError('Agrega al menos un email o username permitido')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock: redirect to the new event (using first mock event ID for demo)
    router.push('/dashboard/event/event-1')
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver</span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Crear nuevo evento</h1>
        <p className="text-muted-foreground mt-1">Configura tu grupo de gastos compartidos</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del evento *</Label>
              <Input
                id="name"
                placeholder="Ej: Viaje a la playa, Cumple de Juan..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripcion (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Agrega una descripcion para tu evento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border min-h-[80px]"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                  <SelectItem value="USD">USD - Dolar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="BRL">BRL - Real</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invite access */}
            <div className="space-y-3">
              <div>
                <Label>Tipo de invitacion *</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Define que va a pasar cuando alguien abra el link del evento.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-[22px] bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setInviteAccess('public')}
                  className={cn(
                    'flex min-h-28 flex-col items-start rounded-[18px] px-3 py-3 text-left transition-colors',
                    inviteAccess === 'public' ? 'bg-card text-primary shadow-[0_4px_16px_rgba(15,23,42,0.04)]' : 'text-muted-foreground'
                  )}
                >
                  <Globe2 className="h-5 w-5" />
                  <span className="mt-2 rounded-full bg-[#E8FAF5] px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                    Recomendado
                  </span>
                  <span className="mt-2 text-sm font-black">Publico</span>
                  <span className="text-xs font-semibold leading-4">Cualquiera con link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInviteAccess('private')}
                  className={cn(
                    'flex min-h-28 flex-col items-start rounded-[18px] px-3 py-3 text-left transition-colors',
                    inviteAccess === 'private' ? 'bg-card text-secondary shadow-[0_4px_16px_rgba(15,23,42,0.04)]' : 'text-muted-foreground'
                  )}
                >
                  <LockKeyhole className="h-5 w-5" />
                  <span className="mt-2 text-sm font-black">Privado</span>
                  <span className="text-xs font-semibold leading-4">Solo invitados</span>
                </button>
              </div>
            </div>

            {inviteAccess === 'public' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Nombres disponibles *</Label>
                  <span className="text-xs text-muted-foreground">
                    {publicParticipantNames.filter((participant) => participant.trim()).length} agregados
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Las personas que entren sin cuenta van a elegir uno de estos nombres.
                </p>

                <div className="space-y-2">
                  {publicParticipantNames.map((participant, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Nombre ${index + 1}`}
                        value={participant}
                        onChange={(e) => updatePublicParticipantName(index, e.target.value)}
                        className="bg-input border-border"
                      />
                      {publicParticipantNames.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePublicParticipantName(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPublicParticipantName}
                  className="gap-2"
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Agregar nombre
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="privateInvitees">Invitados permitidos *</Label>
                <p className="text-sm text-muted-foreground">
                  Solo estas identidades podran aceptar el link privado al iniciar sesion.
                </p>

                <div className="relative">
                  <MailPlus className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    id="privateInvitees"
                    placeholder="maria@email.com, @carlos"
                    value={privateInvitees}
                    onChange={(event) => setPrivateInvitees(event.target.value)}
                    className="min-h-[108px] bg-input pl-10"
                  />
                </div>

                <p className="text-xs font-semibold leading-5 text-muted-foreground">
                  Separa emails o usernames con comas o saltos de linea.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                {isLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Crear evento
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
