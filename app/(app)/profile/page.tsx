'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  User,
  LogOut,
  Check
} from 'lucide-react'
import { mockCurrentUser } from '@/lib/mock-data'
import Link from 'next/link'

export default function ProfilePage() {
  const [name, setName] = useState(mockCurrentUser.name)
  const [email, setEmail] = useState(mockCurrentUser.email)
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Mi perfil</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informacion personal
              </CardTitle>
              <CardDescription>Actualiza tus datos de perfil</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Guardado!
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50 mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Zona de peligro
          </CardTitle>
          <CardDescription>
            Acciones irreversibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Cerrar sesion</p>
              <p className="text-sm text-muted-foreground">Salir de tu cuenta en este dispositivo</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
