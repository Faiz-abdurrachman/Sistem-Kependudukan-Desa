// @ts-nocheck - Temporary workaround for Supabase type inference issues
/**
 * Server Actions untuk CRUD Mutasi Log
 * Mutasi adalah catatan perubahan status penduduk
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createMutasiSchema,
  updateMutasiSchema,
  type CreateMutasiData,
  type UpdateMutasiData,
} from "@/lib/validations/mutasi";

/**
 * Create Mutasi Baru
 */
export async function createMutasi(data: CreateMutasiData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = createMutasiSchema.parse(data);

  // Insert data dengan created_by = user.id
  const { data: newMutasi, error } = await supabase
    .from("mutasi_log")
    .insert({
      ...validatedData,
      created_by: user.id,
    } as Record<string, any>)
    .select()
    .single();

  if (error) {
    console.error("Error creating mutasi:", error);
    return { error: error.message || "Gagal membuat data mutasi" };
  }

  // Trigger akan otomatis update status_dasar penduduk
  revalidatePath("/mutasi");
  revalidatePath(`/penduduk/${validatedData.penduduk_id}`);
  return { data: newMutasi, error: null };
}

/**
 * Update Mutasi
 */
export async function updateMutasi(data: UpdateMutasiData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = updateMutasiSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Update data
  const { data: updatedMutasi, error } = await supabase
    .from("mutasi_log")
    .update(updateData as Record<string, any>)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating mutasi:", error);
    return { error: error.message || "Gagal mengupdate data mutasi" };
  }

  revalidatePath("/mutasi");
  revalidatePath(`/mutasi/${id}`);
  if (updateData.penduduk_id) {
    revalidatePath(`/penduduk/${updateData.penduduk_id}`);
  }
  return { data: updatedMutasi, error: null };
}

/**
 * Delete Mutasi
 */
export async function deleteMutasi(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Delete data
  const { error } = await supabase.from("mutasi_log").delete().eq("id", id);

  if (error) {
    console.error("Error deleting mutasi:", error);
    return { error: error.message || "Gagal menghapus data mutasi" };
  }

  revalidatePath("/mutasi");
  return { error: null };
}

/**
 * Get Mutasi List dengan Pagination
 */
export async function getMutasiList(params: {
  page?: number;
  limit?: number;
  search?: string;
  jenis_mutasi?: string;
  penduduk_id?: string;
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
    .from("mutasi_log")
    .select(
      `
      *,
      penduduk:penduduk_id (
        id,
        nik,
        nama_lengkap
      )
    `,
      { count: "exact" }
    )
    .order("tanggal_peristiwa", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filter by jenis_mutasi
  if (params.jenis_mutasi) {
    query = query.eq("jenis_mutasi", params.jenis_mutasi);
  }

  // Filter by penduduk_id
  if (params.penduduk_id) {
    query = query.eq("penduduk_id", params.penduduk_id);
  }

  // Search by keterangan
  if (params.search && params.search.trim()) {
    const searchTerm = params.search.trim();
    query = query.ilike("keterangan", `%${searchTerm}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    const errorInfo = {
      message: error.message || "Unknown error",
      details: error.details || "No details",
      hint: error.hint || "No hint",
      code: error.code || "No code",
    };

    console.error("Error fetching mutasi list:", errorInfo);
    console.error("Full error object:", error);

    const errorMessage =
      error.message ||
      error.details ||
      error.hint ||
      "Gagal mengambil data mutasi";

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
 * Get Mutasi by ID
 */
export async function getMutasiById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mutasi_log")
    .select(
      `
      *,
      penduduk:penduduk_id (
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
    return { data: null, error: error.message };
  }

  return {
    data: data as {
      id: string;
      penduduk_id: string;
      jenis_mutasi: "LAHIR" | "MATI" | "PINDAH_DATANG" | "PINDAH_KELUAR";
      tanggal_peristiwa: string;
      keterangan: string | null;
      created_by: string;
      created_at: string;
      updated_at: string | null;
      penduduk: {
        id: string;
        nik: string;
        nama_lengkap: string;
        tempat_lahir: string | null;
        tgl_lahir: string | null;
        jenis_kelamin: string;
      } | null;
    },
    error: null,
  };
}

/**
 * Import Mutasi dari Excel/CSV
 */
export async function importMutasi(data: any[]) {
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

  // Step 1: Validate and prepare all data
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Map column names (flexible - case insensitive)
      const getValue = (keys: string[]) => {
        for (const key of keys) {
          // Try exact match
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
        return null;
      };

      const mutasiData: any = {
        penduduk_id: getValue([
          "penduduk_id",
          "Penduduk ID",
          "ID Penduduk",
          "id_penduduk",
        ]),
        jenis_mutasi: getValue([
          "jenis_mutasi",
          "Jenis Mutasi",
          "Jenis",
          "jenis",
        ]),
        tanggal_peristiwa: getValue([
          "tanggal_peristiwa",
          "Tanggal Peristiwa",
          "Tanggal",
          "tanggal",
        ]),
        keterangan: getValue(["keterangan", "Keterangan"]) || null,
      };

      // Check required fields
      if (!mutasiData.penduduk_id) {
        throw new Error("penduduk_id wajib diisi");
      }
      if (!mutasiData.jenis_mutasi) {
        throw new Error("jenis_mutasi wajib diisi");
      }
      if (!mutasiData.tanggal_peristiwa) {
        throw new Error("tanggal_peristiwa wajib diisi");
      }

      // Normalize jenis_mutasi - handle various formats
      const jenisMutasiUpper = String(mutasiData.jenis_mutasi)
        .toUpperCase()
        .trim();
      
      // Map common variations to valid enum values
      if (jenisMutasiUpper === "LAHIR" || jenisMutasiUpper.includes("LAHIR")) {
        mutasiData.jenis_mutasi = "LAHIR";
      } else if (jenisMutasiUpper === "MATI" || jenisMutasiUpper.includes("MATI")) {
        mutasiData.jenis_mutasi = "MATI";
      } else if (
        jenisMutasiUpper === "PINDAH_DATANG" ||
        jenisMutasiUpper === "PINDAH DATANG" ||
        jenisMutasiUpper.includes("MASUK") ||
        jenisMutasiUpper.includes("DATANG")
      ) {
        mutasiData.jenis_mutasi = "PINDAH_DATANG";
      } else if (
        jenisMutasiUpper === "PINDAH_KELUAR" ||
        jenisMutasiUpper === "PINDAH KELUAR" ||
        jenisMutasiUpper.includes("KELUAR")
      ) {
        mutasiData.jenis_mutasi = "PINDAH_KELUAR";
      } else if (
        jenisMutasiUpper.includes("PERUBAHAN") ||
        jenisMutasiUpper.includes("STATUS")
      ) {
        // "PERUBAHAN STATUS" - skip atau default ke PINDAH_DATANG
        // Karena tidak ada enum untuk ini, kita skip row ini
        throw new Error(
          `jenis_mutasi "PERUBAHAN STATUS" tidak didukung. Gunakan: LAHIR, MATI, PINDAH_DATANG, atau PINDAH_KELUAR`
        );
      } else {
        throw new Error(
          `jenis_mutasi tidak valid: "${mutasiData.jenis_mutasi}". Harus: LAHIR, MATI, PINDAH_DATANG, atau PINDAH_KELUAR`
        );
      }

      // Convert tanggal ke format YYYY-MM-DD
      if (mutasiData.tanggal_peristiwa) {
        if (typeof mutasiData.tanggal_peristiwa === "string") {
          // Jika sudah format YYYY-MM-DD, gunakan langsung
          if (!/^\d{4}-\d{2}-\d{2}$/.test(mutasiData.tanggal_peristiwa)) {
            // Convert dari Date object atau format lain
            const date = new Date(mutasiData.tanggal_peristiwa);
            if (isNaN(date.getTime())) {
              throw new Error(
                `tanggal_peristiwa tidak valid: ${mutasiData.tanggal_peristiwa}`
              );
            }
            mutasiData.tanggal_peristiwa = date.toISOString().split("T")[0];
          }
        } else if (mutasiData.tanggal_peristiwa instanceof Date) {
          mutasiData.tanggal_peristiwa = mutasiData.tanggal_peristiwa
            .toISOString()
            .split("T")[0];
        } else {
          // Try to convert number (Excel date serial number)
          const date = new Date((mutasiData.tanggal_peristiwa - 25569) * 86400 * 1000);
          if (!isNaN(date.getTime())) {
            mutasiData.tanggal_peristiwa = date.toISOString().split("T")[0];
          } else {
            throw new Error(
              `tanggal_peristiwa tidak valid: ${mutasiData.tanggal_peristiwa}`
            );
          }
        }
      }

      // Validate dengan schema
      const validatedData = createMutasiSchema.parse(mutasiData);
      validData.push({ ...validatedData, _rowIndex: i + 2 });
    } catch (error: any) {
      errors.push(`Baris ${i + 2}: ${error.message || "Data tidak valid"}`);
    }
  }

  // Step 2: Batch insert
  for (let i = 0; i < validData.length; i += batchSize) {
    const batch = validData.slice(i, i + batchSize);
    const insertData = batch.map(({ _rowIndex, ...data }) => ({
      ...data,
      created_by: user.id,
      // tanggal_peristiwa sudah dalam format string YYYY-MM-DD dari validation
    }));

    const { error } = await supabase
      .from("mutasi_log")
      .insert(insertData as Record<string, any>[]);

    if (error) {
      batch.forEach((item) => {
        errors.push(`Baris ${item._rowIndex}: ${error.message}`);
      });
    } else {
      success += batch.length;
    }
  }

  if (success > 0) {
    revalidatePath("/mutasi");
  }

  return { success, errors };
}
