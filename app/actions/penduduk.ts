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

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Map column names (flexible)
      const pendudukData: any = {
        kk_id: row["kk_id"] || row["KK ID"] || row["Kartu Keluarga ID"],
        nik: String(row["nik"] || row["NIK"] || "").padStart(16, "0"),
        nama_lengkap: row["nama_lengkap"] || row["Nama Lengkap"] || row["Nama"],
        tempat_lahir: row["tempat_lahir"] || row["Tempat Lahir"],
        tgl_lahir: row["tgl_lahir"] || row["Tanggal Lahir"] || row["Tgl Lahir"],
        jenis_kelamin:
          row["jenis_kelamin"] || row["Jenis Kelamin"] || row["JK"],
        gol_darah:
          row["gol_darah"] || row["Golongan Darah"] || row["Gol Darah"] || "-",
        agama: row["agama"] || row["Agama"],
        status_kawin:
          row["status_kawin"] || row["Status Kawin"] || row["Status"],
        shdk: row["shdk"] || row["SHDK"],
        pendidikan: row["pendidikan"] || row["Pendidikan"],
        pekerjaan: row["pekerjaan"] || row["Pekerjaan"],
        nama_ayah: row["nama_ayah"] || row["Nama Ayah"],
        nama_ibu: row["nama_ibu"] || row["Nama Ibu"],
        status_dasar: row["status_dasar"] || row["Status Dasar"] || "HIDUP",
      };

      // Convert tanggal lahir
      if (pendudukData.tgl_lahir) {
        if (typeof pendudukData.tgl_lahir === "string") {
          pendudukData.tgl_lahir = new Date(pendudukData.tgl_lahir);
        }
      }

      // Validate
      const validatedData = createPendudukSchema.parse(pendudukData);

      // Check NIK duplicate
      const { data: existing } = await supabase
        .from("penduduk")
        .select("id")
        .eq("nik", validatedData.nik)
        .single();

      if (existing) {
        errors.push(`Baris ${i + 2}: NIK ${validatedData.nik} sudah terdaftar`);
        continue;
      }

      // Insert
      const { error } = await supabase.from("penduduk").insert({
        ...validatedData,
        tgl_lahir: validatedData.tgl_lahir.toISOString().split("T")[0],
      });

      if (error) {
        errors.push(`Baris ${i + 2}: ${error.message}`);
      } else {
        success++;
      }
    } catch (error: any) {
      errors.push(`Baris ${i + 2}: ${error.message || "Data tidak valid"}`);
    }
  }

  if (success > 0) {
    revalidatePath("/penduduk");
  }

  return { success, errors };
}
