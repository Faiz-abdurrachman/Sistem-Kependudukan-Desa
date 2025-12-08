// @ts-nocheck - Temporary workaround for Supabase type inference issues
/**
 * Server Actions untuk CRUD Penduduk
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPendudukSchema,
  updatePendudukSchema,
  type CreatePendudukData,
  type UpdatePendudukData,
} from "@/lib/validations/penduduk";

/**
 * Create Penduduk Baru
 */
export async function createPenduduk(data: CreatePendudukData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = createPendudukSchema.parse(data);

  // Check NIK duplicate
  const { data: existingPenduduk } = await supabase
    .from("penduduk")
    .select("id")
    .eq("nik", validatedData.nik)
    .single();

  if (existingPenduduk) {
    return { error: "NIK sudah terdaftar" };
  }

  // Insert data
  const { data: newPenduduk, error } = await supabase
    .from("penduduk")
    .insert({
      ...validatedData,
      tgl_lahir: validatedData.tgl_lahir.toISOString().split("T")[0],
    } as any)
    .select()
    .single();

  if (error) {
    // Error logged for debugging (remove in production if needed)
    return { error: error.message || "Gagal membuat data penduduk" };
  }

  revalidatePath("/penduduk");
  return { data: newPenduduk, error: null };
}

/**
 * Update Penduduk
 */
export async function updatePenduduk(data: UpdatePendudukData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = updatePendudukSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Check NIK duplicate (jika NIK diubah)
  if (updateData.nik) {
    const { data: existingPenduduk } = await supabase
      .from("penduduk")
      .select("id")
      .eq("nik", updateData.nik)
      .neq("id", id)
      .single();

    if (existingPenduduk) {
      return { error: "NIK sudah terdaftar" };
    }
  }

  // Prepare update data
  const dataToUpdate: Record<string, any> = { ...updateData };
  if (dataToUpdate.tgl_lahir) {
    dataToUpdate.tgl_lahir = dataToUpdate.tgl_lahir.toISOString().split("T")[0];
  }

  // Update data
  const { data: updatedPenduduk, error } = await supabase
    .from("penduduk")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating penduduk:", error);
    return { error: error.message || "Gagal mengupdate data penduduk" };
  }

  revalidatePath("/penduduk");
  revalidatePath(`/penduduk/${id}`);
  return { data: updatedPenduduk, error: null };
}

/**
 * Delete Penduduk (Soft Delete - ubah status_dasar)
 */
export async function deletePenduduk(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Soft delete: ubah status_dasar menjadi PINDAH
  const { error } = await supabase
    .from("penduduk")
    .update({ status_dasar: "PINDAH" } as Record<string, any>)
    .eq("id", id);

  if (error) {
    // Error logged for debugging (remove in production if needed)
    return { error: error.message || "Gagal menghapus data penduduk" };
  }

  revalidatePath("/penduduk");
  return { error: null };
}

/**
 * Get Penduduk List dengan Pagination
 */
export async function getPendudukList(params: {
  page?: number;
  limit?: number;
  search?: string;
  status_dasar?: "HIDUP" | "MATI" | "PINDAH";
}) {
  const supabase = await createClient();

  // Check authentication first
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Authentication error (remove in production if needed)
    return {
      data: [],
      count: 0,
      totalPages: 0,
      error: "User tidak terautentikasi",
      errorCode: "AUTH_ERROR",
    };
  }

  const page = params.page || 1;
  const limit = params.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("penduduk")
    .select(
      `
      *,
      kartu_keluarga:kk_id (
        nomor_kk,
        alamat_lengkap
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filter by status_dasar
  if (params.status_dasar) {
    query = query.eq("status_dasar", params.status_dasar);
  }

  // Search by NIK or nama
  if (params.search && params.search.trim()) {
    const searchTerm = `%${params.search.trim()}%`;
    query = query.or(
      `nik.ilike.${searchTerm},nama_lengkap.ilike.${searchTerm}`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    // Log error dengan format yang lebih jelas
    const errorInfo = {
      message: error.message || "Unknown error",
      details: error.details || "No details",
      hint: error.hint || "No hint",
      code: error.code || "No code",
    };

    // Error logged for debugging (remove in production if needed)

    // Return error message yang lebih informatif
    const errorMessage =
      error.message ||
      error.details ||
      error.hint ||
      "Gagal mengambil data penduduk";

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
 * Get Penduduk by ID
 */
export async function getPendudukById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("penduduk")
    .select(
      `
      *,
      kartu_keluarga:kk_id (
        id,
        nomor_kk,
        alamat_lengkap,
        wilayah:wilayah_id (
          dusun,
          rw,
          rt
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    // Error logged for debugging (remove in production if needed)
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Import Penduduk dari Excel/CSV
 */
export async function importPenduduk(data: any[]) {
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
  const batchSize = 50; // Process 50 records at a time
  const validData: any[] = [];

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
      const pendudukData: any = {
        kk_id: getValue([
          "kk_id",
          "KK ID",
          "Kartu Keluarga ID",
          "kartu_keluarga_id",
        ]),
        nik: String(
          getValue(["nik", "NIK"]) || ""
        ).padStart(16, "0"),
        nama_lengkap: getValue([
          "nama_lengkap",
          "Nama Lengkap",
          "Nama",
          "nama",
        ]),
        tempat_lahir: getValue(["tempat_lahir", "Tempat Lahir", "tempat_lahir"]),
        tgl_lahir: getValue([
          "tgl_lahir",
          "Tanggal Lahir",
          "Tgl Lahir",
          "tanggal_lahir",
        ]),
        jenis_kelamin: getValue([
          "jenis_kelamin",
          "Jenis Kelamin",
          "JK",
          "jenis_kelamin",
        ]),
        gol_darah: getValue([
          "gol_darah",
          "Golongan Darah",
          "Gol Darah",
          "gol_darah",
        ]) || "-",
        agama: getValue(["agama", "Agama"]),
        status_kawin: getValue([
          "status_kawin",
          "Status Kawin",
          "Status",
          "status_kawin",
        ]),
        shdk: getValue(["shdk", "SHDK"]),
        pendidikan: getValue(["pendidikan", "Pendidikan"]),
        pekerjaan: getValue(["pekerjaan", "Pekerjaan"]),
        nama_ayah: getValue(["nama_ayah", "Nama Ayah"]),
        nama_ibu: getValue(["nama_ibu", "Nama Ibu"]),
        status_dasar: getValue([
          "status_dasar",
          "Status Dasar",
          "status_dasar",
        ]) || "HIDUP",
      };

      // Check required fields
      if (!pendudukData.nik || pendudukData.nik.length !== 16) {
        throw new Error("NIK harus 16 digit");
      }
      if (!pendudukData.nama_lengkap) {
        throw new Error("nama_lengkap wajib diisi");
      }
      if (!pendudukData.tgl_lahir) {
        throw new Error("tgl_lahir wajib diisi");
      }

      // Convert tanggal lahir
      if (pendudukData.tgl_lahir) {
        if (typeof pendudukData.tgl_lahir === "string") {
          const date = new Date(pendudukData.tgl_lahir);
          if (isNaN(date.getTime())) {
            throw new Error(`tgl_lahir tidak valid: ${pendudukData.tgl_lahir}`);
          }
          pendudukData.tgl_lahir = date;
        } else if (pendudukData.tgl_lahir instanceof Date) {
          // Already a date
        } else {
          // Try Excel date serial number
          const date = new Date((pendudukData.tgl_lahir - 25569) * 86400 * 1000);
          if (!isNaN(date.getTime())) {
            pendudukData.tgl_lahir = date;
          } else {
            throw new Error(`tgl_lahir tidak valid: ${pendudukData.tgl_lahir}`);
          }
        }
      }

      // Validate
      const validatedData = createPendudukSchema.parse(pendudukData);
      validData.push({ ...validatedData, _rowIndex: i + 2 });
    } catch (error: any) {
      errors.push(`Baris ${i + 2}: ${error.message || "Data tidak valid"}`);
    }
  }

  // Step 2: Get all existing NIK untuk check duplicate (batch query)
  if (validData.length > 0) {
    const allNIKs = validData.map((d) => d.nik);
    const { data: existingPenduduk } = await supabase
      .from("penduduk")
      .select("nik")
      .in("nik", allNIKs);

    const existingNIKs = new Set((existingPenduduk || []).map((p) => p.nik));

    // Step 3: Filter out duplicates
    const toInsert = validData.filter((data) => {
      if (existingNIKs.has(data.nik)) {
        errors.push(`Baris ${data._rowIndex}: NIK ${data.nik} sudah terdaftar`);
        return false;
      }
      existingNIKs.add(data.nik); // Add to set untuk avoid duplicate dalam batch
      return true;
    });

    // Step 4: Batch insert
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const insertData = batch.map(({ _rowIndex, ...data }) => ({
        ...data,
        tgl_lahir: data.tgl_lahir.toISOString().split("T")[0],
      }));

      const { error } = await supabase.from("penduduk").insert(insertData);

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
    revalidatePath("/penduduk");
  }

  return { success, errors };
}
