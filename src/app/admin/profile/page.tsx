'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ProfileData {
  id: number
  nama: string
  username: string
  role: string
  created_at: string
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const result = await response.json()
      
      if (result.success) {
        setProfile(result.data)
        setFormData(prev => ({
          ...prev,
          nama: result.data.nama,
          username: result.data.username
        }))
      } else {
        toast.error('Gagal memuat profil')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat profil')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi'
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Password lama harus diisi untuk mengubah password'
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password baru minimal 6 karakter'
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsUpdating(true)

    try {
      const updateData: any = {
        nama: formData.nama,
        username: formData.username
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Profil berhasil diperbarui')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        fetchProfile()
      } else {
        toast.error(result.message || 'Gagal memperbarui profil')
        if (result.field) {
          setErrors({ [result.field]: result.message })
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui profil')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-600 mt-2">Kelola informasi akun Anda</p>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">Memuat profil...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600 mt-2">Kelola informasi akun Anda</p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="text-white text-lg font-bold">
                {profile?.nama.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.nama}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Administrator
                </Badge>
                <span className="text-sm text-gray-500">@{profile?.username}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Dibuat pada</p>
              <p className="font-medium">
                {profile ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <Badge className="bg-green-100 text-green-700">Aktif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Perbarui Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Informasi Dasar</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    disabled={isUpdating}
                    className={errors.nama ? 'border-red-500' : ''}
                  />
                  {errors.nama && <p className="text-sm text-red-600 mt-1">{errors.nama}</p>}
                </div>
                
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={isUpdating}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Ubah Password</h3>
              <p className="text-sm text-gray-600">Kosongkan jika tidak ingin mengubah password</p>
              
              <div>
                <Label htmlFor="currentPassword">Password Lama</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  disabled={isUpdating}
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
                {errors.currentPassword && <p className="text-sm text-red-600 mt-1">{errors.currentPassword}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    disabled={isUpdating}
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>}
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={isUpdating}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700">
                {isUpdating ? 'Memperbarui...' : 'Perbarui Profil'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}