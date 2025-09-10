import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      redirect('/admin')
    case 'petugas_pkp':
      redirect('/petugas-pkp')
    case 'ar':
      redirect('/ar')
    default:
      redirect('/login')
  }
}