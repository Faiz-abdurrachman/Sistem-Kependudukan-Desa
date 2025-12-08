// @ts-nocheck - Temporary workaround for Supabase type inference issues with kartu_keluarga table
/**
 * Server Actions untuk CRUD Kartu Keluarga
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createKartuKeluargaSchema,
  updateKartuKeluargaSchema,
  type CreateKartuKeluargaData,
  type UpdateKartuKeluargaData,
} from "@/lib/validations/kartu-keluarga";
import type { Database } from "@/types/database.types";

/**
 * Create Kartu Keluarga Baru
 */
export async function createKartuKeluarga(data: CreateKartuKeluargaData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = createKartuKeluargaSchema.parse(data);

  // Check Nomor KK duplicate
  const { data: existingKK } = await supabase
    .from("kartu_keluarga")
    .select("id")
    .eq("nomor_kk", validatedData.nomor_kk)
    .single();

  if (existingKK) {
    return { error: "Nomor KK sudah terdaftar" };
  }

  // Insert data
  const { data: newKK, error } = await supabase
    .from("kartu_keluarga")
    .insert(validatedData as any)
    .select()
    .single();

  if (error) {
    console.error("Error creating kartu keluarga:", error);
    return { error: error.message || "Gagal membuat data kartu keluarga" };
  }

  revalidatePath("/kartu-keluarga");
  return { data: newKK, error: null };
}

/**
 * Update Kartu Keluarga
 */
export async function updateKartuKeluarga(data: UpdateKartuKeluargaData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = updateKartuKeluargaSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Check Nomor KK duplicate (jika Nomor KK diubah)
  if (updateData.nomor_kk) {
    const { data: existingKK } = await supabase
      .from("kartu_keluarga")
      .select("id")
      .eq("nomor_kk", updateData.nomor_kk)
      .neq("id", id)
      .single();

    if (existingKK) {
      return { error: "Nomor KK sudah terdaftar" };
    }
  }

  // Prepare update data (same approach as penduduk.ts)
  const dataToUpdate: Record<string, any> = { ...updateData };

  // Update data - using same pattern as penduduk.ts which works
  const { data: updatedKK, error } = await supabase
    .from("kartu_keluarga")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating kartu keluarga:", error);
    return { error: error.message || "Gagal mengupdate data kartu keluarga" };
  }

  revalidatePath("/kartu-keluarga");
  revalidatePath(`/kartu-keluarga/${id}`);
  return { data: updatedKK, error: null };
}

/**
 * Delete Kartu Keluarga (Hard Delete - hati-hati!)
 */
export async function deleteKartuKeluarga(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check apakah ada penduduk yang menggunakan KK ini
  const { count: pendudukCount } = await supabase
    .from("penduduk")
    .select("id", { count: "exact", head: true })
    .eq("kk_id", id);

  if (pendudukCount && pendudukCount > 0) {
    return {
      error: "Tidak bisa menghapus Kartu Keluarga yang masih memiliki anggota",
    };
  }

  // Delete data
  const { error } = await supabase.from("kartu_keluarga").delete().eq("id", id);

  if (error) {
    console.error("Error deleting kartu keluarga:", error);
    return { error: error.message || "Gagal menghapus data kartu keluarga" };
  }

  revalidatePath("/kartu-keluarga");
  return { error: null };
}

/**
 * Get Kartu Keluarga List dengan Pagination
 */
export async function getKartuKeluargaList(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      data: [],
      count: 0,
      totalPages: 0,
      error: "Unauthorized",
    };
  }

  const page = params.page || 1;
  const limit = params.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("kartu_keluarga")
    .select(
      `
      *,
      wilayah:wilayah_id (
        dusun,
        rw,
        rt
      ),
      kepala_keluarga:kepala_keluarga_id (
        id,
        nik,
        nama_lengkap
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  // Search by Nomor KK or alamat
  if (params.search && params.search.trim()) {
    const searchTerm = `%${params.search.trim()}%`;
    query = query.or(
      `nomor_kk.ilike.${searchTerm},alamat_lengkap.ilike.${searchTerm}`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    const errorInfo = {
      message: error.message || "Unknown error",
      details: error.details || "No details",
      hint: error.hint || "No hint",
      code: error.code || "No code",
    };

    console.error("Error fetching kartu keluarga:", errorInfo);
    console.error("Full error object:", error);

    const errorMessage =
      error.message ||
      error.details ||
      error.hint ||
      "Gagal mengambil data kartu keluarga";

    return {
      data: [],
      count: 0,
      totalPages: 0,
      error: errorMessage,
      errorCode: error.code || "UNKNOWN",
    };
  }

  const totalCount = count || 0;
  const calculatedTotalPages = Math.ceil(totalCount / limit);

  return {
    data: data || [],
    count: totalCount,
    error: null,
    totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1,
  };
}

/**
 * Get Kartu Keluarga by ID
 */
export async function getKartuKeluargaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("kartu_keluarga")
    .select(
      `
      *,
      wilayah:wilayah_id (
        id,
        dusun,
        rw,
        rt,
        nama_desa,
        nama_kecamatan,
        nama_kabupaten,
        nama_provinsi
      ),
      kepala_keluarga:kepala_keluarga_id (
        id,
        nik,
        nama_lengkap,
        tempat_lahir,
        tgl_lahir,
        jenis_kelamin
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching kartu keluarga:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get Kartu Keluarga List (untuk dropdown)
 */
export async function getKKList() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("kartu_keluarga")
    .select("id, nomor_kk, alamat_lengkap")
    .order("nomor_kk", { ascending: true });

  if (error) {
    console.error("Error fetching KK list:", error);
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
}

/**
 * Import Kartu Keluarga dari Excel/CSV
 */
export async function importKartuKeluarga(data: any[]) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: 0, errors: ["Unauthorized"] };
  }

  const errors: string[] = [];
  let success = 0;
  const batchSize = 50;
  const validData: any[] = [];

  // Step 0: Get all wilayah untuk mapping wilayah_id
  const { data: allWilayah } = await supabase
    .from("wilayah")
    .select("id")
    .order("created_at", { ascending: true }); // Order by created_at untuk konsistensi
  
  // Create mapping dari index ke UUID (untuk format "wilayah-1", "wilayah-2", dll)
  const wilayahMap = new Map<string, string>();
  if (allWilayah && allWilayah.length > 0) {
    allWilayah.forEach((w, index) => {
      // Map "wilayah-1" -> UUID, "wilayah-2" -> UUID, dll (1-based index)
      wilayahMap.set(`wilayah-${index + 1}`, w.id);
      // Juga map langsung dengan UUID jika sudah UUID
      wilayahMap.set(w.id, w.id);
    });
  }

  // Step 1: Validate and prepare all data
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Helper function untuk get value dengan case insensitive
      const getValue = (keys: string[], defaultValue: any = null) => {
        for (const key of keys) {
          if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
            return row[key];
          }
          // Try case insensitive
          const lowerKey = key.toLowerCase();
          for (const rowKey in row) {
            if (rowKey.toLowerCase() === lowerKey) {
              return row[rowKey];
            }
          }
        }
        return defaultValue;
      };

      // Map column names (flexible - case insensitive)
      let wilayahIdValue = getValue(["wilayah_id", "Wilayah ID", "wilayah_id"]);
      
      // Map wilayah_id dari format "wilayah-X" ke UUID
      if (wilayahIdValue) {
        const wilayahIdStr = String(wilayahIdValue).trim();
        
        // Cek apakah sudah UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wilayahIdStr);
        
        if (isUUID) {
          // Sudah UUID, langsung pakai
          wilayahIdValue = wilayahIdStr;
        } else {
          // Coba mapping dari format "wilayah-X"
          const mappedWilayahId = wilayahMap.get(wilayahIdStr);
          if (mappedWilayahId) {
            wilayahIdValue = mappedWilayahId;
          } else {
            throw new Error(
              `wilayah_id tidak valid: "${wilayahIdStr}". Pastikan wilayah sudah diimport terlebih dahulu atau gunakan UUID yang valid.`
            );
          }
        }
      }

      let fotoScanUrl = getValue(["foto_scan_url", "Foto Scan URL", "foto_scan_url"]);
      // Convert empty string to null
      if (fotoScanUrl === "" || fotoScanUrl === null || fotoScanUrl === undefined) {
        fotoScanUrl = null;
      }

      const kkData: any = {
        nomor_kk: String(
          getValue(["nomor_kk", "Nomor KK", "No KK", "nomor_kk"]) || ""
        ).padStart(16, "0"),
        wilayah_id: wilayahIdValue,
        alamat_lengkap: getValue([
          "alamat_lengkap",
          "Alamat Lengkap",
          "Alamat",
          "alamat",
        ]),
        kepala_keluarga_id:
          getValue([
            "kepala_keluarga_id",
            "Kepala Keluarga ID",
            "kepala_keluarga_id",
          ]) || null,
        foto_scan_url: fotoScanUrl,
      };

      // Check required fields
      if (!kkData.nomor_kk || kkData.nomor_kk.length !== 16) {
        throw new Error("nomor_kk harus 16 digit");
      }
      if (!kkData.wilayah_id) {
        throw new Error("wilayah_id wajib diisi");
      }
      if (!kkData.alamat_lengkap) {
        throw new Error("alamat_lengkap wajib diisi");
      }

      // Handle foto_scan_url validation - jika null, skip URL validation
      if (kkData.foto_scan_url === null) {
        // Remove foto_scan_url dari data untuk skip validation
        delete kkData.foto_scan_url;
      }

      // Validate
      const validatedData = createKartuKeluargaSchema.parse(kkData);
      validData.push({ ...validatedData, _rowIndex: i + 2 });
    } catch (error: any) {
      errors.push(`Baris ${i + 2}: ${error.message || "Data tidak valid"}`);
    }
  }

  // Step 2: Get all existing nomor_kk untuk check duplicate (batch query)
  if (validData.length > 0) {
    const allNomorKK = validData.map((d) => d.nomor_kk);
    const { data: existingKK } = await supabase
      .from("kartu_keluarga")
      .select("nomor_kk")
      .in("nomor_kk", allNomorKK);

    const existingSet = new Set((existingKK || []).map((kk) => kk.nomor_kk));

    // Step 3: Filter out duplicates
    const toInsert = validData.filter((data) => {
      if (existingSet.has(data.nomor_kk)) {
        errors.push(
          `Baris ${data._rowIndex}: Nomor KK ${data.nomor_kk} sudah terdaftar`
        );
        return false;
      }
      existingSet.add(data.nomor_kk);
      return true;
    });

    // Step 4: Batch insert
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const insertData = batch.map(({ _rowIndex, ...data }) => data);

      const { error } = await supabase
        .from("kartu_keluarga")
        .insert(insertData as Record<string, any>[]);

      if (error) {
        batch.forEach((item) => {
          errors.push(`Baris ${item._rowIndex}: ${error.message}`);
        });
      } else {
        success += batch.length;
      }
    }
  }

  if (success > 0) {
    revalidatePath("/kartu-keluarga");
  }

  return { success, errors };
}
