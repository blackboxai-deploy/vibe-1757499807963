'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { AuthUser } from '@/lib/auth'
import { toast } from 'sonner'

interface AdminSidebarProps {
  user: AuthUser
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Logout berhasil')
        router.push('/login')
      }
    } catch (error) {
      toast.error('Gagal logout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <div className="text-white text-lg font-bold">KPD</div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">PKP Jember</p>
          </div>
        </div>

        {/* User Info */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="text-blue-600 text-lg font-semibold">
                {user.nama.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.nama}</p>
              <p className="text-sm text-gray-600 truncate">@{user.username}</p>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              Administrator
            </Badge>
          </div>
        </Card>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <Link href="/admin" className="block">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-left font-normal hover:bg-blue-50 hover:text-blue-700"
            >
              <div className="w-5 h-5 mr-3 bg-blue-100 rounded flex-shrink-0"></div>
              Dashboard
            </Button>
          </Link>
          
          <Link href="/admin/users/petugas-pkp" className="block">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-left font-normal hover:bg-blue-50 hover:text-blue-700"
            >
              <div className="w-5 h-5 mr-3 bg-green-100 rounded flex-shrink-0"></div>
              Petugas PKP
            </Button>
          </Link>
          
          <Link href="/admin/users/ar" className="block">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-left font-normal hover:bg-blue-50 hover:text-blue-700"
            >
              <div className="w-5 h-5 mr-3 bg-purple-100 rounded flex-shrink-0"></div>
              Account Representative
            </Button>
          </Link>
          
          <Link href="/admin/profile" className="block">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-left font-normal hover:bg-blue-50 hover:text-blue-700"
            >
              <div className="w-5 h-5 mr-3 bg-gray-100 rounded flex-shrink-0"></div>
              Profil
            </Button>
          </Link>
        </nav>

        <Separator className="my-6" />

        {/* Logout Button */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          {isLoading ? 'Logging out...' : 'Keluar'}
        </Button>
      </div>
    </div>
  )
}