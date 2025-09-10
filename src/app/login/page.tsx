'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Login berhasil!')
        
        // Redirect based on role
        switch (result.user.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'petugas_pkp':
            router.push('/petugas-pkp')
            break
          case 'ar':
            router.push('/ar')
            break
          default:
            router.push('/')
        }
      } else {
        toast.error(result.message || 'Login gagal')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <div className="text-white text-2xl font-bold">KPD</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sistem KPD PKP</h1>
          <p className="text-gray-600 mt-2">Kabupaten Jember</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-center">
              Masukkan username dan password Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium mb-2">Default Login:</p>
                <p>Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
                <p>Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <div className="inline-flex items-center justify-center">
            <Button
              variant="link"
              onClick={() => router.push('/wajib-pajak')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sebagai Wajib Pajak
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}