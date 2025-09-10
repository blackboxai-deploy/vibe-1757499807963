'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { User } from '@/types/database'

export default function ARPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: ''
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?role=ar')
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data)
      } else {
        toast.error('Gagal memuat data AR')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'ar'
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`AR berhasil dibuat. ${result.data.generatedPassword ? `Password: ${result.data.generatedPassword}` : ''}`)
        setIsCreateOpen(false)
        setFormData({ nama: '', username: '', password: '' })
        fetchUsers()
      } else {
        toast.error(result.message || 'Gagal membuat AR')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat AR')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    
    setIsSubmitting(true)

    try {
      const updateData: any = {
        nama: formData.nama,
        username: formData.username
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('AR berhasil diperbarui')
        setIsEditOpen(false)
        setEditingUser(null)
        setFormData({ nama: '', username: '', password: '' })
        fetchUsers()
      } else {
        toast.error(result.message || 'Gagal memperbarui AR')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui AR')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('AR berhasil dihapus')
        fetchUsers()
      } else {
        toast.error(result.message || 'Gagal menghapus AR')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus AR')
    }
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      nama: user.nama,
      username: user.username,
      password: ''
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Account Representative</h1>
          <p className="text-gray-600 mt-2">Kelola data Account Representative (AR)</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Tambah AR
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah AR Baru</DialogTitle>
              <DialogDescription>
                Buat akun Account Representative baru. Jika password kosong, sistem akan generate otomatis.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-nama">Nama Lengkap</Label>
                  <Input
                    id="create-nama"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="create-username">Username</Label>
                  <Input
                    id="create-username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="create-password">Password (opsional)</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isSubmitting}
                    placeholder="Kosongkan untuk generate otomatis"
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Membuat...' : 'Buat AR'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Daftar Account Representative
            <Badge variant="secondary" className="ml-auto">
              {users.length} orang
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Memuat data...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Belum ada AR</div>
              <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah AR" untuk membuat yang pertama</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nama}</TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(user)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus AR</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus <span className="font-medium">{user.nama}</span>?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit AR</DialogTitle>
            <DialogDescription>
              Perbarui informasi Account Representative. Kosongkan password jika tidak ingin mengubah.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nama">Nama Lengkap</Label>
                <Input
                  id="edit-nama"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-password">Password Baru (opsional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isSubmitting}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditOpen(false)
                  setEditingUser(null)
                  setFormData({ nama: '', username: '', password: '' })
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Memperbarui...' : 'Perbarui'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}