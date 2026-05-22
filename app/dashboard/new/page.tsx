'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Users, Plus, X } from 'lucide-react'

export default function NewEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [participants, setParticipants] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const addParticipant = () => {
    setParticipants([...participants, ''])
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index: number, value: string) => {
    const updated = [...participants]
    updated[index] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('El nombre del evento es requerido')
      return
    }

    const validParticipants = participants.filter(p => p.trim())
    if (validParticipants.length === 0) {
      setError('Agrega al menos un participante')
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

            {/* Participants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Participantes *</Label>
                <span className="text-xs text-muted-foreground">
                  {participants.filter(p => p.trim()).length} agregados
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Agrega los nombres de las personas que participaran. Podras agregar mas luego.
              </p>

              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Participante ${index + 1}`}
                      value={participant}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      className="bg-input border-border"
                    />
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(index)}
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
                onClick={addParticipant}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar participante
              </Button>
            </div>

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
