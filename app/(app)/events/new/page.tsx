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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Pencil, UserRoundPlus, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EventIcon, eventIcons, getEventIcon } from '@/lib/event-icons'

export default function NewEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [iconValue, setIconValue] = useState<EventIcon>('plane')
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const [publicParticipantNames, setPublicParticipantNames] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { Icon: EventIconComponent } = getEventIcon(iconValue)

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

    if (validPublicNames.length === 0) {
      setError('Agrega al menos un nombre disponible')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock: redirect to the new event (using first mock event ID for demo)
    router.push('/events/event-1')
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/events" 
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
            {/* Icon */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(true)}
                className="group relative shrink-0"
                aria-label="Elegir icono del evento"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#EAF4FF] text-[#2D9CDB]">
                  <EventIconComponent className="h-8 w-8" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-transform group-hover:scale-110">
                  <Pencil className="h-3 w-3" />
                </span>
              </button>
              <div>
                <p className="text-sm font-black text-foreground">Icono del evento</p>
                <p className="text-xs text-muted-foreground">Toca para cambiar</p>
              </div>
            </div>

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

            {/* Participants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Participantes *</Label>
                <span className="text-xs text-muted-foreground">
                  {publicParticipantNames.filter((participant) => participant.trim()).length} agregados
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Las personas que entren con el link van a elegir uno de estos nombres.
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

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/events" className="flex-1">
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
