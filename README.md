# 🏘️ Sistem Informasi Kependudukan Desa (SID Next-Gen)

> **Aplikasi Web Modern untuk Manajemen Data Kependudukan Desa**

Aplikasi web berbasis Next.js 16 dengan TypeScript untuk mengelola data kependudukan desa secara digital. Dilengkapi dengan fitur lengkap CRUD, import/export data, sistem laporan, dan role-based access control (RBAC) untuk keamanan data yang optimal.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Security](#-security)
- [Database Schema](#-database-schema)
- [Code Quality](#-code-quality)

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) - Server Components & Server Actions
- **Language**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Shadcn/ui (Radix UI + Tailwind)
- **Form Management**: React Hook Form 7.x
- **Validation**: Zod 4.x
- **Charts**: Recharts 3.x
- **State Management**: Zustand 5.x

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Row Level Security**: RLS Policies
- **API**: Next.js Server Actions (No API Routes)

### Export & Utilities
- **Excel Export**: XLSX 0.18.x
- **PDF Export**: jsPDF 3.x + jsPDF-AutoTable
- **Date Handling**: date-fns 4.x
- **Icons**: Lucide React

### Development Tools
- **Linting**: ESLint 9.x + Next.js Config
- **Type Checking**: TypeScript Strict Mode
- **Build Tool**: Turbopack (Next.js 16)

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

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
# Supabase Configuration
# Dapatkan dari: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Cara Mendapatkan Credentials

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **Settings** → **API**
4. Copy **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon/public key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ **Penting**: Jangan commit file `.env.local` ke Git. File ini sudah di-ignore oleh `.gitignore`.

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

## 🧪 Testing & Quality Assurance

### Code Quality

Aplikasi ini mengikuti standar clean code dan best practices:

- ✅ **TypeScript Strict Mode** - Type safety yang ketat
- ✅ **ESLint Configuration** - Code linting dengan Next.js rules
- ✅ **Server Actions** - Server-side logic untuk keamanan
- ✅ **Input Validation** - Zod schema validation
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Code Organization** - Modular dan maintainable structure

### Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)

# Production Build
npm run build        # Build untuk production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Build Status

- ✅ **TypeScript**: No errors
- ✅ **ESLint**: No critical warnings
- ✅ **Build**: Successful
- ✅ **Production Ready**: Yes

## 📊 Code Quality & Standards

### Clean Code Principles

Aplikasi ini dibangun dengan mengikuti prinsip-prinsip clean code:

1. **Separation of Concerns**
   - Server Actions di `app/actions/`
   - Components di `components/`
   - Utilities di `lib/utils/`
   - Validations di `lib/validations/`

2. **Type Safety**
   - TypeScript strict mode
   - Zod schema validation
   - Type inference dari Supabase

3. **Error Handling**
   - Try-catch blocks
   - User-friendly error messages
   - Proper error logging

4. **Code Organization**
   - Consistent naming conventions
   - Modular file structure
   - Reusable components

5. **Performance**
   - Server Components untuk SEO
   - Client Components hanya saat diperlukan
   - Optimized database queries
   - Image optimization

### File & Folder Naming Conventions

- **Files**: `kebab-case.tsx` (e.g., `penduduk-form.tsx`)
- **Components**: `PascalCase` (e.g., `PendudukForm`)
- **Functions**: `camelCase` (e.g., `createPenduduk`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- **Folders**: `kebab-case` (e.g., `kartu-keluarga/`)

### Environment Variables Standards

- Semua environment variables menggunakan prefix `NEXT_PUBLIC_` untuk client-side
- File `.env.local` untuk development (tidak di-commit)
- File `.env.example` sebagai template (di-commit)
- Environment variables di Vercel diatur melalui dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🎯 Key Highlights

### ✨ Modern Architecture
- **Next.js 16 App Router** - Latest Next.js features
- **Server Components** - Optimized performance
- **Server Actions** - Secure server-side operations
- **TypeScript** - Type-safe development

### 🔒 Enterprise-Grade Security
- **JWT Authentication** - Secure token-based auth
- **RBAC** - Role-based access control
- **RLS Policies** - Database-level security
- **Input Validation** - Zod schema validation
- **HTTPS** - Encrypted connections

### 📈 Scalable & Maintainable
- **Modular Architecture** - Easy to extend
- **Clean Code** - Following best practices
- **Type Safety** - Reduced runtime errors
- **Comprehensive Error Handling** - Better UX

### 🚀 Production Ready
- **Optimized Build** - Fast load times
- **SEO Friendly** - Server-side rendering
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Developer** - Initial development and implementation

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Supabase Team** - Powerful backend platform
- **Shadcn/ui Contributors** - Beautiful UI components
- **All Open Source Libraries** - Making development easier

---

<div align="center">

**Built with ❤️ using Next.js 16 & Supabase**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

</div>
