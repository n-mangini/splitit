'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Moon, 
  Globe,
  LogOut,
  Trash2,
  Check
} from 'lucide-react'
import { mockCurrentUser } from '@/lib/mock-data'
import Link from 'next/link'

export default function ProfilePage() {
  const [name, setName] = useState(mockCurrentUser.name)
  const [email, setEmail] = useState(mockCurrentUser.email)
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Settings state
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

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
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informacion personal
          </CardTitle>
          <CardDescription>
            Actualiza tus datos de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <Button variant="outline" size="sm">Cambiar foto</Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
            </div>
          </div>

          <Separator />

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

      {/* Security Card */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Gestiona tu contrasena y seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Cambiar contrasena</p>
              <p className="text-sm text-muted-foreground">Actualiza tu contrasena regularmente</p>
            </div>
            <Button variant="outline">Cambiar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sesiones activas</p>
              <p className="text-sm text-muted-foreground">Gestiona tus dispositivos conectados</p>
            </div>
            <Button variant="outline">Ver sesiones</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura como queres recibir avisos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notificaciones push</p>
              <p className="text-sm text-muted-foreground">Recibir avisos en el navegador</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notificaciones por email</p>
              <p className="text-sm text-muted-foreground">Resumen de actividad semanal</p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Preferencias
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Modo oscuro</p>
              <p className="text-sm text-muted-foreground">Usar tema oscuro siempre</p>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Idioma</p>
              <p className="text-sm text-muted-foreground">Espanol (Argentina)</p>
            </div>
            <Button variant="outline" size="sm">Cambiar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Moneda predeterminada</p>
              <p className="text-sm text-muted-foreground">ARS - Peso Argentino</p>
            </div>
            <Button variant="outline" size="sm">Cambiar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50 mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
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
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Eliminar cuenta</p>
              <p className="text-sm text-muted-foreground">Borrar permanentemente todos tus datos</p>
            </div>
            <Button variant="destructive">Eliminar cuenta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
