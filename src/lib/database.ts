import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import bcrypt from 'bcryptjs';
import { kecamatanData, kelurahanData } from '@/data/jember-geography';

// Database path
const dbPath = join(process.cwd(), 'database.sqlite');

// Initialize database
let db: Database.Database | null = null;

// Skip database operations during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

export function getDatabase() {
  // Skip database during build time
  if (isBuildTime) {
    return null;
  }

  if (!db) {
    try {
      // Ensure database directory exists
      const dbDir = join(process.cwd());
      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
      
      // Initialize database schema
      initializeSchema();
      
      // Seed initial data if needed
      seedInitialData();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
  return db;
}

function initializeSchema() {
  const database = getDatabase();
  if (!database) return;
  
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'petugas_pkp', 'ar')) NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Kecamatan table
  database.exec(`
    CREATE TABLE IF NOT EXISTS kecamatan (
      id INTEGER PRIMARY KEY,
      nama_kecamatan TEXT NOT NULL UNIQUE
    )
  `);

  // Kelurahan table
  database.exec(`
    CREATE TABLE IF NOT EXISTS kelurahan (
      id INTEGER PRIMARY KEY,
      kecamatan_id INTEGER NOT NULL,
      nama_kelurahan TEXT NOT NULL,
      FOREIGN KEY (kecamatan_id) REFERENCES kecamatan (id)
    )
  `);

  // Wilayah AR table
  database.exec(`
    CREATE TABLE IF NOT EXISTS wilayah_ar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kelurahan_id INTEGER NOT NULL UNIQUE,
      ar_id INTEGER,
      FOREIGN KEY (kelurahan_id) REFERENCES kelurahan (id),
      FOREIGN KEY (ar_id) REFERENCES users (id)
    )
  `);

  // PKP Data table
  database.exec(`
    CREATE TABLE IF NOT EXISTS pkp_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomor_kasus TEXT NOT NULL UNIQUE,
      npwp TEXT NOT NULL,
      nama_wp TEXT NOT NULL,
      tanggal_kasus TEXT NOT NULL,
      tanggal_pkp TEXT,
      klu TEXT NOT NULL,
      alamat TEXT NOT NULL,
      kelurahan_id INTEGER NOT NULL,
      kecamatan_id INTEGER NOT NULL,
      nomor_hp TEXT NOT NULL,
      status TEXT CHECK(status IN ('diterima', 'ditolak')) NOT NULL,
      jenis_wp TEXT CHECK(jenis_wp IN ('strategis', 'kewilayahan')) NOT NULL,
      ar_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kelurahan_id) REFERENCES kelurahan (id),
      FOREIGN KEY (kecamatan_id) REFERENCES kecamatan (id),
      FOREIGN KEY (ar_id) REFERENCES users (id)
    )
  `);

  // Perencanaan Survey table
  database.exec(`
    CREATE TABLE IF NOT EXISTS perencanaan_survey (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pkp_data_id INTEGER NOT NULL UNIQUE,
      tanggal_kegiatan_st TEXT,
      tanggal_berangkat_verifikasi TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pkp_data_id) REFERENCES pkp_data (id)
    )
  `);

  // Wawancara table
  database.exec(`
    CREATE TABLE IF NOT EXISTS wawancara (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pkp_data_id INTEGER NOT NULL UNIQUE,
      nomor_surat_tugas TEXT NOT NULL,
      tanggal_surat_tugas TEXT NOT NULL,
      tanggal_kegiatan_st TEXT NOT NULL,
      wp_ditemukan INTEGER NOT NULL,
      alamat_sesuai_coretax INTEGER NOT NULL,
      alamat_baru TEXT,
      kegiatan_usaha_terbukti INTEGER NOT NULL,
      dokumen_perizinan_sesuai INTEGER NOT NULL,
      kegiatan_usaha_sesuai_klu INTEGER NOT NULL,
      klu_baru TEXT,
      kegiatan_usaha_kantor_virtual INTEGER NOT NULL,
      kontrak_provider_virtual INTEGER,
      alamat_kantor_virtual TEXT,
      nama_provider_virtual TEXT,
      surat_pernyataan_disampaikan INTEGER,
      kegiatan_sesuai_pernyataan INTEGER,
      berada_di_kawasan_berikat INTEGER NOT NULL,
      nama_wp_ditemui TEXT NOT NULL,
      nik_wp_ditemui TEXT NOT NULL,
      jabatan_wp_ditemui TEXT NOT NULL,
      nomor_hp_direktur TEXT NOT NULL,
      deskripsi_pj TEXT,
      deskripsi_detail_usaha TEXT NOT NULL,
      alamat_usaha_sama_utama INTEGER NOT NULL,
      alamat_usaha TEXT,
      wp_status TEXT CHECK(wp_status IN ('baru', 'lama')) NOT NULL,
      omzet_tahun_sebelumnya REAL,
      estimasi_omzet_tahun_ini REAL NOT NULL,
      modal_dasar REAL NOT NULL,
      biaya_rill TEXT,
      deskripsi_tambahan TEXT,
      foto_path TEXT,
      shareloc_data TEXT,
      sudah_matoa INTEGER NOT NULL,
      rate_wp INTEGER CHECK(rate_wp >= 1 AND rate_wp <= 10) NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pkp_data_id) REFERENCES pkp_data (id)
    )
  `);

  // Aset table
  database.exec(`
    CREATE TABLE IF NOT EXISTS aset (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wawancara_id INTEGER NOT NULL,
      nama_aset TEXT NOT NULL,
      tahun_perolehan INTEGER NOT NULL,
      harga_perolehan REAL NOT NULL,
      FOREIGN KEY (wawancara_id) REFERENCES wawancara (id) ON DELETE CASCADE
    )
  `);

  // Biaya table
  database.exec(`
    CREATE TABLE IF NOT EXISTS biaya (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wawancara_id INTEGER NOT NULL,
      nama_biaya TEXT NOT NULL,
      nominal REAL NOT NULL,
      keterangan TEXT,
      FOREIGN KEY (wawancara_id) REFERENCES wawancara (id) ON DELETE CASCADE
    )
  `);

  // Kekurangan Berkas table
  database.exec(`
    CREATE TABLE IF NOT EXISTS kekurangan_berkas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wawancara_id INTEGER NOT NULL,
      nama_berkas TEXT NOT NULL,
      FOREIGN KEY (wawancara_id) REFERENCES wawancara (id) ON DELETE CASCADE
    )
  `);

  // Tarif SIK table
  database.exec(`
    CREATE TABLE IF NOT EXISTS tarif_sik (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kecamatan_id INTEGER NOT NULL UNIQUE,
      tarif REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kecamatan_id) REFERENCES kecamatan (id)
    )
  `);

  // Pencairan SIK table
  database.exec(`
    CREATE TABLE IF NOT EXISTS pencairan_sik (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wawancara_id INTEGER NOT NULL UNIQUE,
      tanggal_pencairan TEXT,
      nominal_sik REAL NOT NULL,
      status TEXT CHECK(status IN ('pending', 'dicairkan')) DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wawancara_id) REFERENCES wawancara (id)
    )
  `);

  // Petugas SIK table
  database.exec(`
    CREATE TABLE IF NOT EXISTS petugas_sik (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pencairan_sik_id INTEGER NOT NULL,
      nama_petugas TEXT NOT NULL,
      nip TEXT NOT NULL,
      jabatan TEXT NOT NULL,
      FOREIGN KEY (pencairan_sik_id) REFERENCES pencairan_sik (id) ON DELETE CASCADE
    )
  `);

  // Upload Berkas table
  database.exec(`
    CREATE TABLE IF NOT EXISTS upload_berkas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      npwp TEXT NOT NULL,
      nama_berkas TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
    CREATE INDEX IF NOT EXISTS idx_pkp_data_npwp ON pkp_data (npwp);
    CREATE INDEX IF NOT EXISTS idx_pkp_data_status ON pkp_data (status);
    CREATE INDEX IF NOT EXISTS idx_pkp_data_ar_id ON pkp_data (ar_id);
    CREATE INDEX IF NOT EXISTS idx_wawancara_pkp_data_id ON wawancara (pkp_data_id);
    CREATE INDEX IF NOT EXISTS idx_upload_berkas_npwp ON upload_berkas (npwp);
  `);
}

function seedInitialData() {
  const database = getDatabase();
  if (!database) return;
  
  // Check if data already exists
  const userCount = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const kecamatanCount = database.prepare('SELECT COUNT(*) as count FROM kecamatan').get() as { count: number };
  
  if (userCount.count === 0) {
    // Create default admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    database.prepare(`
      INSERT INTO users (nama, username, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Administrator', 'admin', hashedPassword, 'admin');
    
    console.log('✅ Default admin user created (username: admin, password: admin123)');
  }
  
  if (kecamatanCount.count === 0) {
    // Insert kecamatan data
    const insertKecamatan = database.prepare('INSERT INTO kecamatan (id, nama_kecamatan) VALUES (?, ?)');
    const insertKelurahan = database.prepare('INSERT INTO kelurahan (id, kecamatan_id, nama_kelurahan) VALUES (?, ?, ?)');
    const insertWilayahAR = database.prepare('INSERT INTO wilayah_ar (kelurahan_id, ar_id) VALUES (?, ?)');
    
    const transaction = database.transaction(() => {
      // Insert kecamatan
      for (const kecamatan of kecamatanData) {
        insertKecamatan.run(kecamatan.id, kecamatan.nama_kecamatan);
      }
      
      // Insert kelurahan
      for (const kelurahan of kelurahanData) {
        insertKelurahan.run(kelurahan.id, kelurahan.kecamatan_id, kelurahan.nama_kelurahan);
        // Initialize wilayah_ar with null AR (will be assigned later)
        insertWilayahAR.run(kelurahan.id, null);
      }
    });
    
    transaction();
    console.log('✅ Geographic data (Kecamatan & Kelurahan) seeded successfully');
  }
}

// Database utility functions
export class DatabaseService {
  private db: Database.Database | null;
  
  constructor() {
    this.db = getDatabase();
  }
  
  private ensureDatabase() {
    if (!this.db) {
      throw new Error('Database not available');
    }
    return this.db;
  }
  
  // User operations
  createUser(nama: string, username: string, password: string, role: string) {
    const db = this.ensureDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    return db.prepare(`
      INSERT INTO users (nama, username, password, role)
      VALUES (?, ?, ?, ?)
    `).run(nama, username, hashedPassword, role);
  }
  
  getUserByUsername(username: string) {
    const db = this.ensureDatabase();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }
  
  getUserById(id: number) {
    const db = this.ensureDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  
  getUsersByRole(role: string) {
    const db = this.ensureDatabase();
    return db.prepare('SELECT id, nama, username, role, created_at FROM users WHERE role = ?').all(role);
  }
   updateUser(id: number, data: any) {
    const db = this.ensureDatabase();
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'password' && value) {
        fields.push('password = ?');
        values.push(bcrypt.hashSync(value as string, 10));
      } else if (value !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      return db.prepare(`
        UPDATE users SET ${fields.join(', ')} WHERE id = ?
      `).run(...values);
    }
  }
  
  deleteUser(id: number) {
    const db = this.ensureDatabase();
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }
  
  verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
  
  // Geographic operations
  getAllKecamatan() {
    const db = this.ensureDatabase();
    return db.prepare('SELECT * FROM kecamatan ORDER BY nama_kecamatan').all();
  }
  
  getKelurahanByKecamatan(kecamatanId: number) {
    const db = this.ensureDatabase();
    return db.prepare('SELECT * FROM kelurahan WHERE kecamatan_id = ? ORDER BY nama_kelurahan').all(kecamatanId);
  }
  
  getAllKelurahan() {
    const db = this.ensureDatabase();
    return db.prepare(`
      SELECT k.*, kec.nama_kecamatan 
      FROM kelurahan k 
      JOIN kecamatan kec ON k.kecamatan_id = kec.id 
      ORDER BY kec.nama_kecamatan, k.nama_kelurahan
    `).all();
  }
  
  // Wilayah AR operations
  updateWilayahAR(kelurahanId: number, arId: number | null) {
    const db = this.ensureDatabase();
    return db.prepare('UPDATE wilayah_ar SET ar_id = ? WHERE kelurahan_id = ?').run(arId, kelurahanId);
  }
  
  getWilayahAR() {
    const db = this.ensureDatabase();
    return db.prepare(`
      SELECT wa.*, k.nama_kelurahan, kec.nama_kecamatan, u.nama as ar_nama
      FROM wilayah_ar wa
      JOIN kelurahan k ON wa.kelurahan_id = k.id
      JOIN kecamatan kec ON k.kecamatan_id = kec.id
      LEFT JOIN users u ON wa.ar_id = u.id
      ORDER BY kec.nama_kecamatan, k.nama_kelurahan
    `).all();
  }
  
  getARByKelurahan(kelurahanId: number) {
    const db = this.ensureDatabase();
    return db.prepare(`
      SELECT ar_id FROM wilayah_ar WHERE kelurahan_id = ?
    `).get(kelurahanId);
  }
}

// Export database instance
export const dbService = new DatabaseService();