/**
 * Zod Schema untuk Validasi Mutasi Log
 * Mutasi adalah catatan perubahan status penduduk: LAHIR, MATI, PINDAH_DATANG, PINDAH_KELUAR
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

// Schema untuk Create/Update Mutasi
export const mutasiSchema = z.object({
  penduduk_id: z.string().uuid("ID Penduduk tidak valid"),

  jenis_mutasi: z.enum(["LAHIR", "MATI", "PINDAH_DATANG", "PINDAH_KELUAR"], {
    message: "Jenis mutasi tidak valid",
  }),

  tanggal_peristiwa: dateSchema,

  keterangan: z
    .string()
    .max(500, "Keterangan maksimal 500 karakter")
    .optional()
    .nullable(),
});

// Schema untuk Create
export const createMutasiSchema = mutasiSchema;

// Schema untuk Update (dengan ID, semua field optional kecuali ID)
export const updateMutasiSchema = z
  .object({
    id: z.string().uuid("ID tidak valid"),
  })
  .merge(mutasiSchema.partial());

// Type inference
export type MutasiFormData = z.infer<typeof mutasiSchema>;
export type CreateMutasiData = z.infer<typeof createMutasiSchema>;
export type UpdateMutasiData = z.infer<typeof updateMutasiSchema>;
