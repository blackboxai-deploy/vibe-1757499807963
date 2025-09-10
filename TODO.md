# TODO - Aplikasi KPD PKP

## Phase 1: Database & Authentication Setup
- [x] Setup SQLite database connection dan schema
- [x] Create database types dan interfaces
- [x] Implement authentication system dengan role management
- [x] Create geographic data (Kecamatan/Kelurahan Jember)
- [x] Database seeding dengan initial data

## Phase 2: Core Components & Layout
- [x] Create main layout dengan navigation
- [x] Implement login system
- [x] Create dashboard untuk setiap role (Admin, Petugas PKP, AR)
- [x] Setup routing dan middleware untuk role-based access

## Phase 3: Admin Module
- [x] CRUD Petugas PKP management
- [x] CRUD AR management  
- [x] Profile management system
- [x] Admin dashboard dengan statistik

## Phase 4: Petugas PKP Module
- [ ] CRUD Data PKP dengan AR assignment logic
- [ ] CRUD Wilayah AR (mapping kelurahan-AR)
- [ ] Perencanaan Survey dengan monitoring deadline
- [ ] Form Wawancara komprehensif dengan conditional fields
- [ ] CRUD Tarif SIK per kecamatan
- [ ] System Pencairan SIK dengan workflow

## Phase 5: AR Module  
- [ ] Input KPD Kewilayahan interface
- [ ] View hasil wawancara dari Petugas PKP
- [ ] Monitoring dashboard untuk pending verifications

## Phase 6: Public Portal
- [ ] Public interface untuk WP upload berkas
- [ ] NPWP validation dan document management
- [ ] File upload security dan organization

## Phase 7: File Management & Security
- [ ] Implement secure file upload system
- [ ] Create file organization structure
- [ ] Add input validation menggunakan Zod
- [ ] Implement CSRF protection

## Phase 8: Testing & Deployment Preparation
- [ ] **AUTOMATIC**: Process placeholder images (placehold.co URLs) → AI-generated images
  - This step executes automatically when placeholders are detected
  - No manual action required - system triggers automatically
  - Ensures all images are ready before testing
- [ ] API testing dengan curl untuk semua endpoints
- [ ] Build dan test production deployment
- [ ] Create deployment documentation

## Current Status: Starting Phase 1 - Database Setup