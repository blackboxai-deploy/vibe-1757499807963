// Database types untuk aplikasi KPD PKP
export type UserRole = 'admin' | 'petugas_pkp' | 'ar';
export type PKPStatus = 'diterima' | 'ditolak';
export type JenisWP = 'strategis' | 'kewilayahan';
export type WPStatus = 'baru' | 'lama';

// User Management
export interface User {
  id: number;
  nama: string;
  username: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Geographic Data
export interface Kecamatan {
  id: number;
  nama_kecamatan: string;
}

export interface Kelurahan {
  id: number;
  kecamatan_id: number;
  nama_kelurahan: string;
  kecamatan?: Kecamatan;
}

export interface WilayahAR {
  id: number;
  kelurahan_id: number;
  ar_id: number | null;
  kelurahan?: Kelurahan;
  ar?: User;
}

// PKP Data
export interface PKPData {
  id: number;
  nomor_kasus: string;
  npwp: string;
  nama_wp: string;
  tanggal_kasus: string;
  tanggal_pkp: string | null;
  klu: string;
  alamat: string;
  kelurahan_id: number;
  kecamatan_id: number;
  nomor_hp: string;
  status: PKPStatus;
  jenis_wp: JenisWP;
  ar_id: number | null;
  created_at: string;
  updated_at: string;
  kelurahan?: Kelurahan;
  kecamatan?: Kecamatan;
  ar?: User;
}

// Survey Management
export interface PerencanaanSurvey {
  id: number;
  pkp_data_id: number;
  tanggal_kegiatan_st: string | null;
  tanggal_berangkat_verifikasi: string | null;
  created_at: string;
  updated_at: string;
  pkp_data?: PKPData;
}

// Wawancara
export interface Wawancara {
  id: number;
  pkp_data_id: number;
  nomor_surat_tugas: string;
  tanggal_surat_tugas: string;
  tanggal_kegiatan_st: string;
  wp_ditemukan: boolean;
  alamat_sesuai_coretax: boolean;
  alamat_baru: string | null;
  kegiatan_usaha_terbukti: boolean;
  dokumen_perizinan_sesuai: boolean;
  kegiatan_usaha_sesuai_klu: boolean;
  klu_baru: string | null;
  kegiatan_usaha_kantor_virtual: boolean;
  kontrak_provider_virtual: boolean | null;
  alamat_kantor_virtual: string | null;
  nama_provider_virtual: string | null;
  surat_pernyataan_disampaikan: boolean | null;
  kegiatan_sesuai_pernyataan: boolean | null;
  berada_di_kawasan_berikat: boolean;
  nama_wp_ditemui: string;
  nik_wp_ditemui: string;
  jabatan_wp_ditemui: string;
  nomor_hp_direktur: string;
  deskripsi_pj: string | null;
  deskripsi_detail_usaha: string;
  alamat_usaha_sama_utama: boolean;
  alamat_usaha: string | null;
  wp_status: WPStatus;
  omzet_tahun_sebelumnya: number | null;
  estimasi_omzet_tahun_ini: number;
  modal_dasar: number;
  biaya_rill: string | null;
  deskripsi_tambahan: string | null;
  foto_path: string | null;
  shareloc_data: string | null;
  sudah_matoa: boolean;
  rate_wp: number;
  created_at: string;
  updated_at: string;
  pkp_data?: PKPData;
}

// Aset
export interface Aset {
  id: number;
  wawancara_id: number;
  nama_aset: string;
  tahun_perolehan: number;
  harga_perolehan: number;
}

// Biaya
export interface Biaya {
  id: number;
  wawancara_id: number;
  nama_biaya: string;
  nominal: number;
  keterangan: string | null;
}

// Kekurangan Berkas
export interface KekuranganBerkas {
  id: number;
  wawancara_id: number;
  nama_berkas: string;
}

// Tarif SIK
export interface TarifSIK {
  id: number;
  kecamatan_id: number;
  tarif: number;
  created_at: string;
  updated_at: string;
  kecamatan?: Kecamatan;
}

// Pencairan SIK
export interface PencairanSIK {
  id: number;
  wawancara_id: number;
  tanggal_pencairan: string | null;
  nominal_sik: number;
  status: 'pending' | 'dicairkan';
  created_at: string;
  updated_at: string;
  wawancara?: Wawancara;
}

export interface PetugasSIK {
  id: number;
  pencairan_sik_id: number;
  nama_petugas: string;
  nip: string;
  jabatan: string;
}

// Upload Berkas WP
export interface UploadBerkas {
  id: number;
  npwp: string;
  nama_berkas: string;
  file_path: string;
  uploaded_at: string;
}

// Input Types untuk Forms
export interface CreateUserInput {
  nama: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput {
  nama?: string;
  username?: string;
  password?: string;
}

export interface CreatePKPDataInput {
  nomor_kasus: string;
  npwp: string;
  nama_wp: string;
  tanggal_kasus: string;
  tanggal_pkp?: string;
  klu: string;
  alamat: string;
  kelurahan_id: number;
  kecamatan_id: number;
  nomor_hp: string;
  status: PKPStatus;
  jenis_wp: JenisWP;
  ar_id?: number;
}

export interface CreateWawancaraInput {
  pkp_data_id: number;
  nomor_surat_tugas: string;
  tanggal_surat_tugas: string;
  tanggal_kegiatan_st: string;
  wp_ditemukan: boolean;
  alamat_sesuai_coretax: boolean;
  alamat_baru?: string;
  kegiatan_usaha_terbukti: boolean;
  dokumen_perizinan_sesuai: boolean;
  kegiatan_usaha_sesuai_klu: boolean;
  klu_baru?: string;
  kegiatan_usaha_kantor_virtual: boolean;
  kontrak_provider_virtual?: boolean;
  alamat_kantor_virtual?: string;
  nama_provider_virtual?: string;
  surat_pernyataan_disampaikan?: boolean;
  kegiatan_sesuai_pernyataan?: boolean;
  berada_di_kawasan_berikat: boolean;
  nama_wp_ditemui: string;
  nik_wp_ditemui: string;
  jabatan_wp_ditemui: string;
  nomor_hp_direktur: string;
  deskripsi_pj?: string;
  deskripsi_detail_usaha: string;
  alamat_usaha_sama_utama: boolean;
  alamat_usaha?: string;
  wp_status: WPStatus;
  omzet_tahun_sebelumnya?: number;
  estimasi_omzet_tahun_ini: number;
  modal_dasar: number;
  biaya_rill?: string;
  deskripsi_tambahan?: string;
  foto_path?: string;
  shareloc_data?: string;
  sudah_matoa: boolean;
  rate_wp: number;
  aset?: Array<{
    nama_aset: string;
    tahun_perolehan: number;
    harga_perolehan: number;
  }>;
  biaya?: Array<{
    nama_biaya: string;
    nominal: number;
    keterangan?: string;
  }>;
  kekurangan_berkas?: Array<{
    nama_berkas: string;
  }>;
}

// Dashboard Data Types
export interface DashboardStats {
  total_pkp: number;
  pkp_diterima: number;
  pkp_ditolak: number;
  survey_pending: number;
  survey_deadline_warning: number;
  wawancara_completed: number;
  sik_pending: number;
  sik_dicairkan: number;
}

export interface ARStats {
  total_wilayah: number;
  pkp_assigned: number;
  verifikasi_completed: number;
  kpd_pending: number;
}