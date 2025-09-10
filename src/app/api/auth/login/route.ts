import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { LoginCredentials } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json()
    
    // Validate input
    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }
    
    const result = await login(credentials)
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 401 })
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem' },
      { status: 500 }
    )
  }
}