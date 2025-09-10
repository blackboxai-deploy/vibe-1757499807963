import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { dbService } from '@/lib/database'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['admin'])
    
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna tidak valid' },
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    
    // Validate that we're not updating admin user
    const existingUser = dbService.getUserById(userId) as any
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      )
    }
    
    if (existingUser.role === 'admin') {
      return NextResponse.json(
        { success: false, message: 'Tidak dapat mengupdate admin user' },
        { status: 403 }
      )
    }
    
    try {
      dbService.updateUser(userId, updateData)
      
      return NextResponse.json({
        success: true,
        message: 'Pengguna berhasil diperbarui'
      })
    } catch (dbError: any) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json(
          { success: false, message: 'Username sudah digunakan' },
          { status: 400 }
        )
      }
      throw dbError
    }
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pengguna' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['admin'])
    
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna tidak valid' },
        { status: 400 }
      )
    }
    
    // Validate that we're not deleting admin user
    const existingUser = dbService.getUserById(userId) as any
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      )
    }
    
    if (existingUser.role === 'admin') {
      return NextResponse.json(
        { success: false, message: 'Tidak dapat menghapus admin user' },
        { status: 403 }
      )
    }
    
    dbService.deleteUser(userId)
    
    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pengguna' },
      { status: 500 }
    )
  }
}