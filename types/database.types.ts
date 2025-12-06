/**
 * Database Types untuk TypeScript
 * Generate dari Supabase: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
 *
 * Untuk sementara, kita definisikan manual sesuai schema yang sudah dibuat
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      wilayah: {
        Row: {
          id: string;
          dusun: string;
          rw: string | null;
          rt: string | null;
          nama_desa: string | null;
          nama_kecamatan: string | null;
          nama_kabupaten: string | null;
          nama_provinsi: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dusun: string;
          rw?: string | null;
          rt?: string | null;
          nama_desa?: string | null;
          nama_kecamatan?: string | null;
          nama_kabupaten?: string | null;
          nama_provinsi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dusun?: string;
          rw?: string | null;
          rt?: string | null;
          nama_desa?: string | null;
          nama_kecamatan?: string | null;
          nama_kabupaten?: string | null;
          nama_provinsi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kartu_keluarga: {
        Row: {
          id: string;
          nomor_kk: string;
          kepala_keluarga_id: string | null;
          alamat_lengkap: string;
          wilayah_id: string;
          foto_scan_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_kk: string;
          kepala_keluarga_id?: string | null;
          alamat_lengkap: string;
          wilayah_id: string;
          foto_scan_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_kk?: string;
          kepala_keluarga_id?: string | null;
          alamat_lengkap?: string;
          wilayah_id?: string;
          foto_scan_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      penduduk: {
        Row: {
          id: string;
          kk_id: string;
          nik: string;
          nama_lengkap: string;
          tempat_lahir: string;
          tgl_lahir: string;
          jenis_kelamin: "LAKI-LAKI" | "PEREMPUAN";
          gol_darah: "A" | "B" | "AB" | "O" | "-";
          agama:
            | "ISLAM"
            | "KRISTEN"
            | "KATOLIK"
            | "HINDU"
            | "BUDDHA"
            | "KONGHUCU"
            | "LAINNYA";
          status_kawin: "BELUM KAWIN" | "KAWIN" | "CERAI HIDUP" | "CERAI MATI";
          shdk:
            | "KEPALA KELUARGA"
            | "SUAMI"
            | "ISTRI"
            | "ANAK"
            | "MENANTU"
            | "CUCU"
            | "ORANG TUA"
            | "MERTUA"
            | "FAMILI LAIN"
            | "PEMBANTU"
            | "LAINNYA";
          pendidikan:
            | "TIDAK / BELUM SEKOLAH"
            | "BELUM TAMAT SD"
            | "SD / SEDERAJAT"
            | "SMP / SEDERAJAT"
            | "SMA / SEDERAJAT"
            | "D1 / D2 / D3"
            | "D4 / S1"
            | "S2"
            | "S3";
          pekerjaan: string;
          nama_ayah: string | null;
          nama_ibu: string | null;
          status_dasar: "HIDUP" | "MATI" | "PINDAH";
          foto_ktp_url: string | null;
          foto_akta_lahir_url: string | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kk_id: string;
          nik: string;
          nama_lengkap: string;
          tempat_lahir: string;
          tgl_lahir: string;
          jenis_kelamin: "LAKI-LAKI" | "PEREMPUAN";
          gol_darah?: "A" | "B" | "AB" | "O" | "-";
          agama:
            | "ISLAM"
            | "KRISTEN"
            | "KATOLIK"
            | "HINDU"
            | "BUDDHA"
            | "KONGHUCU"
            | "LAINNYA";
          status_kawin: "BELUM KAWIN" | "KAWIN" | "CERAI HIDUP" | "CERAI MATI";
          shdk:
            | "KEPALA KELUARGA"
            | "SUAMI"
            | "ISTRI"
            | "ANAK"
            | "MENANTU"
            | "CUCU"
            | "ORANG TUA"
            | "MERTUA"
            | "FAMILI LAIN"
            | "PEMBANTU"
            | "LAINNYA";
          pendidikan:
            | "TIDAK / BELUM SEKOLAH"
            | "BELUM TAMAT SD"
            | "SD / SEDERAJAT"
            | "SMP / SEDERAJAT"
            | "SMA / SEDERAJAT"
            | "D1 / D2 / D3"
            | "D4 / S1"
            | "S2"
            | "S3";
          pekerjaan: string;
          nama_ayah?: string | null;
          nama_ibu?: string | null;
          status_dasar?: "HIDUP" | "MATI" | "PINDAH";
          foto_ktp_url?: string | null;
          foto_akta_lahir_url?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kk_id?: string;
          nik?: string;
          nama_lengkap?: string;
          tempat_lahir?: string;
          tgl_lahir?: string;
          jenis_kelamin?: "LAKI-LAKI" | "PEREMPUAN";
          gol_darah?: "A" | "B" | "AB" | "O" | "-";
          agama?:
            | "ISLAM"
            | "KRISTEN"
            | "KATOLIK"
            | "HINDU"
            | "BUDDHA"
            | "KONGHUCU"
            | "LAINNYA";
          status_kawin?: "BELUM KAWIN" | "KAWIN" | "CERAI HIDUP" | "CERAI MATI";
          shdk?:
            | "KEPALA KELUARGA"
            | "SUAMI"
            | "ISTRI"
            | "ANAK"
            | "MENANTU"
            | "CUCU"
            | "ORANG TUA"
            | "MERTUA"
            | "FAMILI LAIN"
            | "PEMBANTU"
            | "LAINNYA";
          pendidikan?:
            | "TIDAK / BELUM SEKOLAH"
            | "BELUM TAMAT SD"
            | "SD / SEDERAJAT"
            | "SMP / SEDERAJAT"
            | "SMA / SEDERAJAT"
            | "D1 / D2 / D3"
            | "D4 / S1"
            | "S2"
            | "S3";
          pekerjaan?: string;
          nama_ayah?: string | null;
          nama_ibu?: string | null;
          status_dasar?: "HIDUP" | "MATI" | "PINDAH";
          foto_ktp_url?: string | null;
          foto_akta_lahir_url?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mutasi_log: {
        Row: {
          id: string;
          penduduk_id: string;
          jenis_mutasi: "LAHIR" | "MATI" | "PINDAH_DATANG" | "PINDAH_KELUAR";
          tanggal_peristiwa: string;
          keterangan: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          penduduk_id: string;
          jenis_mutasi: "LAHIR" | "MATI" | "PINDAH_DATANG" | "PINDAH_KELUAR";
          tanggal_peristiwa: string;
          keterangan?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          penduduk_id?: string;
          jenis_mutasi?: "LAHIR" | "MATI" | "PINDAH_DATANG" | "PINDAH_KELUAR";
          tanggal_peristiwa?: string;
          keterangan?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      surat_keluar: {
        Row: {
          id: string;
          penduduk_id: string;
          jenis_surat:
            | "SKTM"
            | "DOMISILI"
            | "KEMATIAN"
            | "KELAHIRAN"
            | "USAHA"
            | "LAINNYA";
          nomor_surat: string;
          tanggal_cetak: string;
          admin_id: string;
          data_penduduk_snapshot: Json | null;
          file_pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          penduduk_id: string;
          jenis_surat:
            | "SKTM"
            | "DOMISILI"
            | "KEMATIAN"
            | "KELAHIRAN"
            | "USAHA"
            | "LAINNYA";
          nomor_surat: string;
          tanggal_cetak?: string;
          admin_id: string;
          data_penduduk_snapshot?: Json | null;
          file_pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          penduduk_id?: string;
          jenis_surat?:
            | "SKTM"
            | "DOMISILI"
            | "KEMATIAN"
            | "KELAHIRAN"
            | "USAHA"
            | "LAINNYA";
          nomor_surat?: string;
          tanggal_cetak?: string;
          admin_id?: string;
          data_penduduk_snapshot?: Json | null;
          file_pdf_url?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      v_statistik_penduduk_status: {
        Row: {
          status_dasar: "HIDUP" | "MATI" | "PINDAH";
          jumlah: number;
        };
      };
      v_rekap_mutasi_bulanan: {
        Row: {
          bulan: string;
          jenis_mutasi: "LAHIR" | "MATI" | "PINDAH_DATANG" | "PINDAH_KELUAR";
          jumlah: number;
        };
      };
      v_penduduk_per_wilayah: {
        Row: {
          dusun: string;
          rw: string | null;
          rt: string | null;
          jumlah_penduduk: number;
          jumlah_kk: number;
        };
      };
      v_kartu_keluarga_detail: {
        Row: {
          id: string;
          nomor_kk: string;
          alamat_lengkap: string;
          dusun: string;
          rw: string | null;
          rt: string | null;
          nama_kepala_keluarga: string | null;
          nik_kepala_keluarga: string | null;
          jumlah_anggota: number;
          created_at: string;
        };
      };
      v_statistik_demografi: {
        Row: {
          jenis_kelamin: "LAKI-LAKI" | "PEREMPUAN";
          agama: string;
          pendidikan: string;
          status_kawin: string;
          jumlah: number;
        };
      };
    };
    Functions: {
      hitung_umur: {
        Args: {
          tgl_lahir: string;
        };
        Returns: number;
      };
      validasi_nik: {
        Args: {
          nik_input: string;
        };
        Returns: boolean;
      };
    };
  };
};
