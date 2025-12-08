/**
 * Zod Schema untuk Validasi Kartu Keluarga
 */

import { z } from "zod";

// Helper untuk validasi Nomor KK (16 digit)
const nomorKKSchema = z
  .string()
  .length(16, "Nomor KK harus 16 digit")
  .regex(/^[0-9]+$/, "Nomor KK harus berupa angka");

// Schema untuk Create/Update Kartu Keluarga
export const kartuKeluargaSchema = z.object({
  nomor_kk: nomorKKSchema,

  kepala_keluarga_id: z
    .string()
    .uuid("ID Kepala Keluarga tidak valid")
    .optional()
    .nullable(),

  alamat_lengkap: z
    .string()
    .min(10, "Alamat lengkap minimal 10 karakter")
    .max(200, "Alamat lengkap maksimal 200 karakter"),

  wilayah_id: z.string().uuid("ID Wilayah tidak valid"),

  foto_scan_url: z
    .union([
      z.string().url("URL foto scan tidak valid"),
      z.string().length(0), // Allow empty string
      z.null(),
    ])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)), // Transform empty string to null
});

// Schema untuk Create (tanpa ID)
export const createKartuKeluargaSchema = kartuKeluargaSchema;

// Schema untuk Update (dengan ID, semua field optional kecuali ID)
export const updateKartuKeluargaSchema = z
  .object({
    id: z.string().uuid("ID tidak valid"),
  })
  .merge(
    kartuKeluargaSchema.partial().extend({
      nomor_kk: nomorKKSchema.optional(), // Nomor KK bisa diubah
    })
  );

// Type inference
export type KartuKeluargaFormData = z.infer<typeof kartuKeluargaSchema>;
export type CreateKartuKeluargaData = z.infer<typeof createKartuKeluargaSchema>;
export type UpdateKartuKeluargaData = z.infer<typeof updateKartuKeluargaSchema>;
