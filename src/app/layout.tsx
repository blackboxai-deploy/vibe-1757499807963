import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'KPD PKP - Sistem Manajemen Pengesahan Kontrak Pajak',
  description: 'Aplikasi manajemen PKP untuk Kementerian Pajak Kabupaten Jember',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  )
}