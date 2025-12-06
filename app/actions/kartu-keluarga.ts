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

  // Update data
  const { data: updatedKK, error } = await supabase
    .from("kartu_keluarga")
    .update(updateData as Record<string, any>)
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

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Map column names (flexible)
      const kkData: any = {
        nomor_kk: String(
          row["nomor_kk"] || row["Nomor KK"] || row["No KK"] || ""
        ).padStart(16, "0"),
        wilayah_id: row["wilayah_id"] || row["Wilayah ID"],
        alamat_lengkap:
          row["alamat_lengkap"] || row["Alamat Lengkap"] || row["Alamat"],
        kepala_keluarga_id:
          row["kepala_keluarga_id"] || row["Kepala Keluarga ID"] || null,
        foto_scan_url: row["foto_scan_url"] || row["Foto Scan URL"] || null,
      };

      // Validate
      const validatedData = createKartuKeluargaSchema.parse(kkData);

      // Check nomor_kk duplicate
      const { data: existing } = await supabase
        .from("kartu_keluarga")
        .select("id")
        .eq("nomor_kk", validatedData.nomor_kk)
        .single();

      if (existing) {
        errors.push(
          `Baris ${i + 2}: Nomor KK ${validatedData.nomor_kk} sudah terdaftar`
        );
        continue;
      }

      // Insert
      const { error } = await supabase
        .from("kartu_keluarga")
        .insert(validatedData as Record<string, any>);

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
    revalidatePath("/kartu-keluarga");
  }

  return { success, errors };
}
