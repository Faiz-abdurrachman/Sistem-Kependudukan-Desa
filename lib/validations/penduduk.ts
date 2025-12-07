/**
 * Zod Schema untuk Validasi Penduduk
 * Sesuai dengan database schema dan standar F-1.01
 */

import { z } from "zod";

// Helper untuk validasi NIK (16 digit)
const nikSchema = z
  .string()
  .length(16, "NIK harus 16 digit")
  .regex(/^[0-9]+$/, "NIK harus berupa angka");

// Helper untuk validasi tanggal (tidak boleh di masa depan)
// Preprocess string dari HTML input type="date" ke Date object
const dateSchema = z.preprocess(
  (val) => {
    // Convert string ke Date jika perlu
    if (typeof val === "string") {
      const date = new Date(val);
      // Check jika valid date
      if (isNaN(date.getTime())) {
        return val; // Return as-is untuk trigger error
      }
      return date;
    }
    // Jika sudah Date object, return as-is
    return val;
  },
  z
    .date({
      message: "Tanggal tidak valid",
    })
    .max(new Date(), "Tanggal tidak boleh di masa depan")
);

// Schema untuk Create/Update Penduduk
export const pendudukSchema = z
  .object({
    kk_id: z.string().uuid("ID Kartu Keluarga tidak valid"),

    nik: nikSchema,

    nama_lengkap: z
      .string()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),

    tempat_lahir: z
      .string()
      .min(2, "Tempat lahir minimal 2 karakter")
      .max(50, "Tempat lahir maksimal 50 karakter"),

    tgl_lahir: dateSchema,

    jenis_kelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"], {
      message: "Pilih jenis kelamin",
    }),

    gol_darah: z.enum(["A", "B", "AB", "O", "-"], {
      message: "Pilih golongan darah",
    }),

    agama: z.enum(
      ["ISLAM", "KRISTEN", "KATOLIK", "HINDU", "BUDDHA", "KONGHUCU", "LAINNYA"],
      {
        message: "Pilih agama",
      }
    ),

    status_kawin: z.enum(
      ["BELUM KAWIN", "KAWIN", "CERAI HIDUP", "CERAI MATI"],
      {
        message: "Pilih status kawin",
      }
    ),

    shdk: z.enum(
      [
        "KEPALA KELUARGA",
        "SUAMI",
        "ISTRI",
        "ANAK",
        "MENANTU",
        "CUCU",
        "ORANG TUA",
        "MERTUA",
        "FAMILI LAIN",
        "PEMBANTU",
        "LAINNYA",
      ],
      {
        message: "Pilih SHDK",
      }
    ),

    pendidikan: z.enum(
      [
        "TIDAK / BELUM SEKOLAH",
        "BELUM TAMAT SD",
        "SD / SEDERAJAT",
        "SMP / SEDERAJAT",
        "SMA / SEDERAJAT",
        "D1 / D2 / D3",
        "D4 / S1",
        "S2",
        "S3",
      ],
      {
        message: "Pilih pendidikan",
      }
    ),

    pekerjaan: z
      .string()
      .min(2, "Pekerjaan minimal 2 karakter")
      .max(50, "Pekerjaan maksimal 50 karakter"),

    nama_ayah: z
      .string()
      .max(100, "Nama ayah maksimal 100 karakter")
      .optional(),

    nama_ibu: z.string().max(100, "Nama ibu maksimal 100 karakter").optional(),

    status_dasar: z.enum(["HIDUP", "MATI", "PINDAH"], {
      message: "Pilih status dasar",
    }),

    foto_ktp_url: z
      .string()
      .url("URL foto KTP tidak valid")
      .optional()
      .nullable(),

    foto_akta_lahir_url: z
      .string()
      .url("URL foto akta lahir tidak valid")
      .optional()
      .nullable(),

    catatan: z
      .string()
      .max(500, "Catatan maksimal 500 karakter")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validasi: Jika status kawin bukan BELUM KAWIN, umur minimal 17 tahun
      if (data.status_kawin !== "BELUM KAWIN") {
        const today = new Date();
        const birthDate = new Date(data.tgl_lahir);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          return age - 1 >= 17;
        }
        return age >= 17;
      }
      return true;
    },
    {
      message: "Umur minimal 17 tahun untuk status kawin selain BELUM KAWIN",
      path: ["tgl_lahir"],
    }
  );

// Schema untuk Create (tanpa ID)
export const createPendudukSchema = pendudukSchema;

// Schema untuk Update (dengan ID, semua field optional kecuali ID)
export const updatePendudukSchema = z
  .object({
    id: z.string().uuid("ID tidak valid"),
  })
  .merge(
    pendudukSchema.partial().extend({
      nik: nikSchema.optional(), // NIK bisa diubah
    })
  );

// Type inference
export type PendudukFormData = z.infer<typeof pendudukSchema>;
export type CreatePendudukData = z.infer<typeof createPendudukSchema>;
export type UpdatePendudukData = z.infer<typeof updatePendudukSchema>;
