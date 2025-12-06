/**
 * Zod Schema untuk Validasi Wilayah
 * Wilayah adalah hierarki administratif: Desa → Dusun → RW → RT
 */

import { z } from "zod";

// Schema untuk Create/Update Wilayah
export const wilayahSchema = z.object({
  dusun: z
    .string()
    .min(1, "Dusun wajib diisi")
    .max(100, "Dusun maksimal 100 karakter"),

  rw: z
    .string()
    .max(10, "RW maksimal 10 karakter")
    .optional()
    .nullable(),

  rt: z
    .string()
    .max(10, "RT maksimal 10 karakter")
    .optional()
    .nullable(),

  nama_desa: z
    .string()
    .max(100, "Nama desa maksimal 100 karakter")
    .optional()
    .nullable(),

  nama_kecamatan: z
    .string()
    .max(100, "Nama kecamatan maksimal 100 karakter")
    .optional()
    .nullable(),

  nama_kabupaten: z
    .string()
    .max(100, "Nama kabupaten maksimal 100 karakter")
    .optional()
    .nullable(),

  nama_provinsi: z
    .string()
    .max(100, "Nama provinsi maksimal 100 karakter")
    .optional()
    .nullable(),
});

// Schema untuk Create
export const createWilayahSchema = wilayahSchema;

// Schema untuk Update (dengan ID, semua field optional kecuali ID)
export const updateWilayahSchema = z
  .object({
    id: z.string().uuid("ID tidak valid"),
  })
  .merge(wilayahSchema.partial());

// Type inference
export type WilayahFormData = z.infer<typeof wilayahSchema>;
export type CreateWilayahData = z.infer<typeof createWilayahSchema>;
export type UpdateWilayahData = z.infer<typeof updateWilayahSchema>;


