/**
 * Zod Schema untuk Validasi Surat Keluar
 * Surat Keluar adalah arsip persuratan yang dikeluarkan untuk penduduk
 */

import { z } from "zod";

// Helper untuk validasi tanggal (tidak boleh di masa depan)
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .refine(
    (date) => {
      const dateObj = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dateObj <= today;
    },
    { message: "Tanggal tidak boleh di masa depan" }
  );

// Schema untuk Create/Update Surat Keluar
export const suratKeluarSchema = z.object({
  penduduk_id: z.string().uuid("ID Penduduk tidak valid"),

  jenis_surat: z.enum(
    ["SKTM", "DOMISILI", "KEMATIAN", "KELAHIRAN", "USAHA", "LAINNYA"],
    {
      message: "Jenis surat tidak valid",
    }
  ),

  nomor_surat: z
    .string()
    .min(5, "Nomor surat minimal 5 karakter")
    .max(100, "Nomor surat maksimal 100 karakter"),

  tanggal_cetak: dateSchema,

  file_pdf_url: z
    .string()
    .url("URL file PDF tidak valid")
    .optional()
    .nullable(),
});

// Schema untuk Create
export const createSuratKeluarSchema = suratKeluarSchema;

// Schema untuk Update (dengan ID, semua field optional kecuali ID)
export const updateSuratKeluarSchema = z
  .object({
    id: z.string().uuid("ID tidak valid"),
  })
  .merge(suratKeluarSchema.partial());

// Type inference
export type SuratKeluarFormData = z.infer<typeof suratKeluarSchema>;
export type CreateSuratKeluarData = z.infer<typeof createSuratKeluarSchema>;
export type UpdateSuratKeluarData = z.infer<typeof updateSuratKeluarSchema>;
