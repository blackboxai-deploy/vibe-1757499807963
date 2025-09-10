import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel administrasi sistem KPD PKP</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">-</div>
            <p className="text-sm text-gray-500 mt-1">Semua pengguna sistem</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Petugas PKP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">-</div>
            <p className="text-sm text-gray-500 mt-1">Petugas PKP aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Account Representative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">-</div>
            <p className="text-sm text-gray-500 mt-1">AR aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kecamatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">31</div>
            <p className="text-sm text-gray-500 mt-1">Kecamatan di Jember</p>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Status Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">Database</p>
                <p className="text-sm text-green-700">Terhubung dan berjalan normal</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Authentication</p>
                <p className="text-sm text-blue-700">Sistem autentikasi aktif</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Aktif
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sistem telah diinisialisasi</p>
                  <p className="text-xs text-gray-500">Database dan user admin telah dibuat</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Data geografis telah dimuat</p>
                  <p className="text-xs text-gray-500">31 Kecamatan dan 135 Kelurahan Jember</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-medium text-gray-900">Tambah Petugas PKP</h3>
              <p className="text-sm text-gray-600 mt-1">Buat akun petugas PKP baru</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
              </div>
              <h3 className="font-medium text-gray-900">Tambah AR</h3>
              <p className="text-sm text-gray-600 mt-1">Buat akun Account Representative</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
              </div>
              <h3 className="font-medium text-gray-900">Kelola Profil</h3>
              <p className="text-sm text-gray-600 mt-1">Update profil dan password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}