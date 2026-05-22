'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Por favor ingresa tu email')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver al login</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-2xl font-bold text-foreground">SplitIt</span>
            </Link>
          </div>

          <Card className="bg-card border-border">
            {!isSubmitted ? (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">Recupera tu contrasena</CardTitle>
                  <CardDescription>
                    Ingresa tu email y te enviaremos instrucciones para recuperar tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-input border-border"
                        autoComplete="email"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        'Enviar instrucciones'
                      )}
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Recordaste tu contrasena?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Inicia sesion
                    </Link>
                  </p>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">Revisa tu email</CardTitle>
                  <CardDescription>
                    Enviamos instrucciones para recuperar tu contrasena a <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <p>Si no recibes el email en unos minutos:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Revisa tu carpeta de spam</li>
                      <li>Verifica que el email sea correcto</li>
                    </ul>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                  >
                    Intentar con otro email
                  </Button>

                  <Link href="/login">
                    <Button className="w-full">
                      Volver al login
                    </Button>
                  </Link>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
