import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { dbService } from './database';
import type { User, UserRole } from '@/types/database';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'kpd-pkp-secret-key');

export interface AuthUser {
  id: number;
  nama: string;
  username: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function createToken(user: AuthUser) {
  return await new SignJWT({ 
    id: user.id, 
    nama: user.nama, 
    username: user.username, 
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // Validate payload structure before casting
    if (
      typeof payload.id === 'number' &&
      typeof payload.nama === 'string' &&
      typeof payload.username === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        id: payload.id as number,
        nama: payload.nama as string,
        username: payload.username as string,
        role: payload.role as UserRole
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: AuthUser }> {
  try {
    const user = dbService.getUserByUsername(credentials.username) as User;
    
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan' };
    }
    
    const isValid = dbService.verifyPassword(credentials.password, user.password);
    
    if (!isValid) {
      return { success: false, message: 'Password salah' };
    }
    
    const authUser: AuthUser = {
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role
    };
    
    const token = await createToken(authUser);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return { success: true, message: 'Login berhasil', user: authUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  
  return user;
}

// Middleware helpers
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role;
}

export function hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}

export function isPetugasPKP(user: AuthUser | null): boolean {
  return hasRole(user, 'petugas_pkp');
}

export function isAR(user: AuthUser | null): boolean {
  return hasRole(user, 'ar');
}

// Password utilities
export function generateRandomPassword(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}