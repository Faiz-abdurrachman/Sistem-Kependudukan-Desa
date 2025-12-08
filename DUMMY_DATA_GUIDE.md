# 📋 Panduan Import Data Dummy

Panduan lengkap untuk mengimport data dummy ke dalam sistem.

## 🎯 Overview

File `dummy-data.xlsx` berisi data dummy untuk semua fitur:

- **Wilayah**: 200 data (5 dusun × 5 RW × 8 RT)
- **Kartu Keluarga**: ~200 data (satu per wilayah)
- **Penduduk**: ~800-1000 data (3-7 anggota per KK)
- **Mutasi**: ~160-200 data (20% dari penduduk)
- **Surat Keluar**: ~80-100 data (10% dari penduduk)

## 📦 Cara Generate Data Dummy

### 1. Install Dependencies (jika belum)

```bash
npm install xlsx
```

### 2. Generate File Excel

```bash
node scripts/generate-dummy-data.js
```

File akan tersimpan di: `public/dummy-data.xlsx`

## 📥 Cara Import Data (Step by Step)

### ⚠️ PENTING: Urutan Import Harus Benar!

Data harus diimport sesuai urutan karena ada dependency:

1. **Wilayah** → 2. **Kartu Keluarga** → 3. **Penduduk** → 4. **Mutasi** → 5. **Surat Keluar**

---

## Step 1: Import Wilayah

1. Buka halaman **Wilayah** (`/wilayah`)
2. Klik tombol **"Im3. Pilih file `dummy-data.xlsx`
port Data"**
4. **PENTING**: Pilih sheet **"Wilayah"** (bukan sheet lain!)
5. Klik **"Import"**
6. Tunggu sampai selesai
7. **Catat ID Wilayah** yang terbuat (akan digunakan di Step 2)

### 📝 Catatan:

- Setelah import, buka halaman Wilayah
- Copy **ID** dari beberapa wilayah (minimal 5-10 ID)
- Simpan ID-ID ini untuk digunakan di Step 2

---

## Step 2: Import Kartu Keluarga

### ⚠️ SEBELUM IMPORT: Update File Excel!

1. Buka file `dummy-data.xlsx`
2. Buka sheet **"Kartu Keluarga"**
3. Kolom `wilayah_id` masih berisi placeholder (`wilayah-1`, `wilayah-2`, dll)
4. **Ganti** dengan ID wilayah yang sudah diimport di Step 1:
   - Buka halaman Wilayah di aplikasi
   - Copy ID wilayah yang sudah terbuat
   - Paste ke kolom `wilayah_id` di Excel
   - Ulangi untuk semua baris
5. Simpan file Excel

### Import:

1. Buka halaman **Kartu Keluarga** (`/kartu-keluarga`)
2. Klik tombol **"Import Data"**
3. Pilih file `dummy-data.xlsx` yang sudah diupdate
4. Pilih sheet **"Kartu Keluarga"**
5. Klik **"Import"**
6. Tunggu sampai selesai
7. **Catat ID Kartu Keluarga** yang terbuat (akan digunakan di Step 3)

### 📝 Catatan:

- Setelah import, buka halaman Kartu Keluarga
- Copy **ID** dari beberapa KK (minimal 20-30 ID)
- Simpan ID-ID ini untuk digunakan di Step 3

---

## Step 3: Import Penduduk

### ⚠️ SEBELUM IMPORT: Update File Excel Lagi!

1. Buka file `dummy-data.xlsx`
2. Buka sheet **"Penduduk"**
3. Kolom `kk_id` masih berisi placeholder (`kk-1`, `kk-2`, dll)
4. **Ganti** dengan ID Kartu Keluarga yang sudah diimport di Step 2:
   - Buka halaman Kartu Keluarga di aplikasi
   - Copy ID KK yang sudah terbuat
   - Paste ke kolom `kk_id` di Excel
   - **PENTING**: Pastikan anggota keluarga yang sama punya `kk_id` yang sama!
   - Contoh: Jika ada 5 anggota keluarga, semua 5 baris harus punya `kk_id` yang sama
5. Simpan file Excel

### Import:

1. Buka halaman **Penduduk** (`/penduduk`)
2. Klik tombol **"Import Data"**
3. Pilih file `dummy-data.xlsx` yang sudah diupdate
4. Pilih sheet **"Penduduk"**
5. Klik **"Import"**
6. Tunggu sampai selesai (ini mungkin agak lama karena banyak data)

### 📝 Catatan:

- Setelah import, buka halaman Penduduk
- Copy **ID** dari beberapa penduduk (minimal 50-100 ID)
- Simpan ID-ID ini untuk digunakan di Step 4 & 5

---

## Step 4: Import Mutasi (Opsional)

### ⚠️ SEBELUM IMPORT: Update File Excel!

1. Buka file `dummy-data.xlsx`
2. Buka sheet **"Mutasi"**
3. Kolom `penduduk_id` masih berisi placeholder (`penduduk-1`, `penduduk-2`, dll)
4. **Ganti** dengan ID Penduduk yang sudah diimport di Step 3:
   - Buka halaman Penduduk di aplikasi
   - Copy ID penduduk yang sudah terbuat
   - Paste ke kolom `penduduk_id` di Excel
5. **Hapus kolom `created_by`** (akan diisi otomatis oleh sistem)
6. Simpan file Excel

### Import:

1. Buka halaman **Mutasi** (`/mutasi`)
2. Klik tombol **"Import Data"**
3. Pilih file `dummy-data.xlsx` yang sudah diupdate
4. Pilih sheet **"Mutasi"**
5. Klik **"Import"**
6. Tunggu sampai selesai

---

## Step 5: Import Surat Keluar (Opsional)

### ⚠️ SEBELUM IMPORT: Update File Excel!

1. Buka file `dummy-data.xlsx`
2. Buka sheet **"Surat Keluar"**
3. Kolom `penduduk_id` masih berisi placeholder (`penduduk-1`, `penduduk-2`, dll)
4. **Ganti** dengan ID Penduduk yang sudah diimport di Step 3:
   - Buka halaman Penduduk di aplikasi
   - Copy ID penduduk yang sudah terbuat
   - Paste ke kolom `penduduk_id` di Excel
5. **Hapus kolom `admin_id` dan `data_penduduk_snapshot`** (akan diisi otomatis oleh sistem)
6. Simpan file Excel

### Import:

1. Buka halaman **Surat Keluar** (`/surat-keluar`)
2. Klik tombol **"Import Data"**
3. Pilih file `dummy-data.xlsx` yang sudah diupdate
4. Pilih sheet **"Surat Keluar"**
5. Klik **"Import"**
6. Tunggu sampai selesai

---

## 🎨 Format Kolom yang Diperlukan

### Wilayah

- `dusun` (required)
- `rw` (optional)
- `rt` (optional)
- `nama_desa` (optional)
- `nama_kecamatan` (optional)
- `nama_kabupaten` (optional)
- `nama_provinsi` (optional)

### Kartu Keluarga

- `nomor_kk` (required, 16 digit)
- `wilayah_id` (required, UUID dari wilayah)
- `alamat_lengkap` (required)
- `kepala_keluarga_id` (optional, UUID dari penduduk)
- `foto_scan_url` (optional)

### Penduduk

- `kk_id` (required, UUID dari kartu keluarga)
- `nik` (required, 16 digit)
- `nama_lengkap` (required)
- `tempat_lahir` (required)
- `tgl_lahir` (required, format: YYYY-MM-DD)
- `jenis_kelamin` (required: LAKI-LAKI atau PEREMPUAN)
- `gol_darah` (required: A, B, AB, O, atau -)
- `agama` (required: ISLAM, KRISTEN, KATOLIK, HINDU, BUDDHA, KONGHUCU)
- `status_kawin` (required: BELUM KAWIN, KAWIN, CERAI HIDUP, CERAI MATI)
- `shdk` (required: KEPALA KELUARGA, SUAMI, ISTRI, ANAK, dll)
- `pendidikan` (required)
- `pekerjaan` (required)
- `nama_ayah` (optional)
- `nama_ibu` (optional)
- `status_dasar` (required: HIDUP, MATI, atau PINDAH)
- `catatan` (optional)

### Mutasi

- `penduduk_id` (required, UUID dari penduduk)
- `jenis_mutasi` (required: PINDAH MASUK, PINDAH KELUAR, LAHIR, MATI, PERUBAHAN STATUS)
- `tanggal_peristiwa` (required, format: YYYY-MM-DD)
- `keterangan` (optional)

### Surat Keluar

- `penduduk_id` (required, UUID dari penduduk)
- `jenis_surat` (required)
- `nomor_surat` (required)
- `tanggal_cetak` (required, format: YYYY-MM-DD)
- `keterangan` (optional)

---

## ⚡ Tips & Trik

### 1. Import Bertahap

Jika data terlalu banyak, import secara bertahap:

- Import 50-100 data dulu
- Test apakah berhasil
- Lanjutkan import sisanya

### 2. Backup Data

Sebelum import, backup data yang sudah ada (jika ada)

### 3. Check Error

Setelah import, selalu check:

- Berapa data yang berhasil diimport
- Berapa data yang gagal (dan kenapa)
- Error message biasanya muncul di toast notification

### 4. Update ID Manual

Jika malas update ID di Excel, bisa:

- Import Wilayah dulu
- Copy ID dari aplikasi
- Import KK dengan ID yang sudah dicopy
- Ulangi untuk Penduduk, Mutasi, dan Surat

### 5. Generate Ulang Data

Jika ada masalah, generate ulang data:

```bash
node scripts/generate-dummy-data.js
```

---

## 🐛 Troubleshooting

### Error: "NIK sudah terdaftar"

- **Solusi**: Generate ulang data dummy (NIK akan berbeda)

### Error: "Nomor KK sudah terdaftar"

- **Solusi**: Generate ulang data dummy (Nomor KK akan berbeda)

### Error: "ID tidak valid"

- **Solusi**: Pastikan ID yang di-copy dari aplikasi adalah UUID yang valid
- Jangan copy ID placeholder dari Excel

### Error: "Kombinasi Dusun/RW/RT sudah terdaftar"

- **Solusi**: Data wilayah sudah ada, skip atau hapus dulu yang lama

### Import Lambat

- **Normal**: Import banyak data memang butuh waktu
- **Solusi**: Import secara bertahap (50-100 data per batch)

---

## ✅ Checklist Import

- [ ] Generate data dummy (`node scripts/generate-dummy-data.js`)
- [ ] Import Wilayah
- [ ] Copy ID Wilayah dari aplikasi
- [ ] Update `wilayah_id` di sheet Kartu Keluarga
- [ ] Import Kartu Keluarga
- [ ] Copy ID Kartu Keluarga dari aplikasi
- [ ] Update `kk_id` di sheet Penduduk
- [ ] Import Penduduk
- [ ] Copy ID Penduduk dari aplikasi
- [ ] Update `penduduk_id` di sheet Mutasi (opsional)
- [ ] Import Mutasi (opsional)
- [ ] Update `penduduk_id` di sheet Surat Keluar (opsional)
- [ ] Import Surat Keluar (opsional)
- [ ] Check dashboard untuk melihat statistik

---

## 🎉 Setelah Import

Setelah semua data diimport, kamu bisa:

1. ✅ Lihat statistik di Dashboard
2. ✅ Filter dan search data di semua halaman
3. ✅ Generate laporan
4. ✅ Test semua fitur dengan data real

**Selamat! Data dummy sudah siap digunakan! 🚀**
