import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { dbService } from '@/lib/database'
import { generateRandomPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin'])
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    let users
    if (role) {
      users = dbService.getUsersByRole(role)
    } else {
      // Get all non-admin users
      const petugasPKP = dbService.getUsersByRole('petugas_pkp')
      const ar = dbService.getUsersByRole('ar')
      users = [...petugasPKP, ...ar]
    }
    
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pengguna' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin'])
    
    const { nama, username, role, password } = await request.json()
    
    // Validate input
    if (!nama || !username || !role) {
      return NextResponse.json(
        { success: false, message: 'Nama, username, dan role harus diisi' },
        { status: 400 }
      )
    }
    
    if (!['petugas_pkp', 'ar'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Role tidak valid' },
        { status: 400 }
      )
    }
    
    // Generate password if not provided
    const finalPassword = password || generateRandomPassword(8)
    
    try {
      const result = dbService.createUser(nama, username, finalPassword, role)
      
      return NextResponse.json({
        success: true,
        message: 'Pengguna berhasil dibuat',
        data: {
          id: result.lastInsertRowid,
          nama,
          username,
          role,
          generatedPassword: !password ? finalPassword : undefined
        }
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
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat pengguna' },
      { status: 500 }
    )
  }
}