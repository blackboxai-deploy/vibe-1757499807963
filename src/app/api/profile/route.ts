import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { dbService } from '@/lib/database'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }
    
    const profile = dbService.getUserById(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil tidak ditemukan' },
        { status: 404 }
      )
    }
    
    // Remove password from response
    const { password, ...profileData } = profile as any
    
    return NextResponse.json({ success: true, data: profileData })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil profil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }
    
    const { nama, username, currentPassword, newPassword } = await request.json()
    
    // Validate input
    if (!nama || !username) {
      return NextResponse.json(
        { success: false, message: 'Nama dan username harus diisi' },
        { status: 400 }
      )
    }
    
    const updateData: any = { nama, username }
    
    // If password change is requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Password lama harus diisi',
            field: 'currentPassword'
          },
          { status: 400 }
        )
      }
      
      // Verify current password
      const currentUser = dbService.getUserById(user.id) as any
      const isValidPassword = dbService.verifyPassword(currentPassword, currentUser.password)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Password lama tidak benar',
            field: 'currentPassword'
          },
          { status: 400 }
        )
      }
      
      updateData.password = newPassword
    }
    
    try {
      dbService.updateUser(user.id, updateData)
      
      return NextResponse.json({
        success: true,
        message: 'Profil berhasil diperbarui'
      })
    } catch (dbError: any) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Username sudah digunakan',
            field: 'username'
          },
          { status: 400 }
        )
      }
      throw dbError
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui profil' },
      { status: 500 }
    )
  }
}