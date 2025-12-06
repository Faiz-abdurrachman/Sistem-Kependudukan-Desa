# 🏘️ Sistem Informasi Kependudukan Desa (SID Next-Gen)

Aplikasi web modern untuk mengelola data kependudukan desa dengan fitur lengkap CRUD, import/export, laporan, dan role-based access control.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Validation**: React Hook Form + Zod
- **Charts**: Recharts
- **Export**: XLSX, jsPDF

## ✨ Features

### 📊 Core Features

- ✅ **CRUD Penduduk** - Kelola data penduduk lengkap
- ✅ **CRUD Kartu Keluarga** - Kelola data kartu keluarga
- ✅ **CRUD Wilayah** - Kelola data wilayah (Dusun, RW, RT)
- ✅ **CRUD Mutasi** - Catatan mutasi penduduk (Lahir, Mati, Pindah)
- ✅ **CRUD Surat Keluar** - Arsip surat keluar

### 📈 Dashboard & Analytics

- ✅ Dashboard dengan statistik real-time
- ✅ Charts & visualisasi data
- ✅ Recent activity tracking
- ✅ Quick actions

### 📥 Import/Export

- ✅ Import data dari Excel/CSV (Wilayah, Penduduk, KK)
- ✅ Export data ke Excel/CSV per modul
- ✅ Export All Data (semua modul sekaligus)
- ✅ Backup Database (JSON format)

### 📋 Laporan

- ✅ 16 jenis laporan (Penduduk, Mutasi, Surat, Statistik)
- ✅ Generate laporan real-time dari database
- ✅ Download Excel

### ⚙️ Settings

- ✅ Profile Settings
- ✅ System Settings
- ✅ Security Settings (Change Password, Active Sessions)
- ✅ Notification Settings
- ✅ User Management (Admin only)

### 🔐 Security & Access Control

- ✅ Authentication dengan Supabase Auth
- ✅ Role-Based Access Control (RBAC)
  - **ADMIN**: Full access
  - **OPERATOR**: CRUD access
  - **USER**: Read-only access
- ✅ Row Level Security (RLS) di database
- ✅ Protected routes dengan middleware

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase account

### Setup

1. **Clone repository**

```bash
git clone <repository-url>
cd sid-nextgen
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local dengan Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup database**

- Run SQL script di Supabase SQL Editor: `database_rbac_setup.sql`
- Setup RLS policies sesuai kebutuhan

5. **Run development server**

```bash
npm run dev
```

6. **Open browser**

```
http://localhost:3000
```

## 📁 Project Structure

```
sid-nextgen/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── penduduk/         # CRUD Penduduk
│   │   ├── kartu-keluarga/   # CRUD Kartu Keluarga
│   │   ├── wilayah/          # CRUD Wilayah
│   │   ├── mutasi/           # CRUD Mutasi
│   │   ├── surat-keluar/     # CRUD Surat Keluar
│   │   ├── laporan/          # Report Generator
│   │   └── pengaturan/       # Settings
│   ├── actions/              # Server Actions
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # Shadcn components
│   ├── layout/               # Layout components
│   ├── penduduk/             # Penduduk components
│   ├── kartu-keluarga/       # KK components
│   ├── wilayah/              # Wilayah components
│   ├── mutasi/               # Mutasi components
│   ├── surat-keluar/         # Surat components
│   ├── reports/               # Report components
│   └── settings/             # Settings components
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── utils/                # Utility functions
│   └── validations/          # Zod schemas
└── types/                    # TypeScript types
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login**

```bash
vercel login
```

3. **Deploy**

```bash
cd sid-nextgen
vercel --prod
```

4. **Set Environment Variables**

- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Configure Supabase**

- Go to Supabase Dashboard → Settings → API
- Add Vercel URL to Allowed URLs

## 📝 Usage

### Login

1. Buka aplikasi
2. Login dengan email & password
3. Redirect ke dashboard

### Manage Data

- **Penduduk**: Tambah, edit, hapus, cari data penduduk
- **Kartu Keluarga**: Kelola data KK
- **Wilayah**: Kelola data wilayah
- **Mutasi**: Catat mutasi penduduk
- **Surat Keluar**: Arsip surat keluar

### Import/Export

- **Import**: Upload file Excel/CSV untuk bulk import
- **Export**: Download data ke Excel/CSV
- **Backup**: Backup semua data ke JSON

### Generate Reports

- Pilih jenis laporan
- Generate & download Excel

## 🔐 Role-Based Access Control

### ADMIN

- Full access (CRUD semua modul)
- Settings access
- User management

### OPERATOR

- CRUD access (tidak bisa settings)
- Tidak bisa manage users

### USER

- Read-only access
- Tidak bisa create/update/delete

## 🛡️ Security

- ✅ Authentication dengan Supabase Auth (JWT)
- ✅ Authorization dengan RBAC
- ✅ Row Level Security (RLS) di database
- ✅ Input validation dengan Zod
- ✅ Server Actions (server-side only)
- ✅ HTTPS (auto di Vercel)

## 📊 Database Schema

### Main Tables

- `penduduk` - Data penduduk
- `kartu_keluarga` - Data kartu keluarga
- `wilayah` - Data wilayah
- `mutasi_log` - Log mutasi penduduk
- `surat_keluar` - Arsip surat keluar
- `user_roles` - User roles untuk RBAC

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📚 Additional Resources

Untuk dokumentasi lengkap setup, deployment, dan penggunaan, silakan lihat dokumentasi internal project.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team
- Supabase team
- Shadcn/ui contributors
- All open source libraries used

---

**Built with ❤️ using Next.js & Supabase**
