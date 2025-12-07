// @ts-nocheck - Temporary workaround for Supabase type inference issues
/**
 * Server Actions untuk CRUD Surat Keluar
 * Surat Keluar adalah arsip persuratan
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createSuratKeluarSchema,
  updateSuratKeluarSchema,
  type CreateSuratKeluarData,
  type UpdateSuratKeluarData,
} from "@/lib/validations/surat-keluar";
import { getPendudukById } from "@/app/actions/penduduk";

/**
 * Create Surat Keluar Baru
 */
export async function createSuratKeluar(data: CreateSuratKeluarData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = createSuratKeluarSchema.parse(data);

  // Check Nomor Surat duplicate
  const { data: existingSurat } = await supabase
    .from("surat_keluar")
    .select("id")
    .eq("nomor_surat", validatedData.nomor_surat)
    .single();

  if (existingSurat) {
    return { error: "Nomor surat sudah terdaftar" };
  }

  // Get penduduk data untuk snapshot
  const { data: pendudukData } = await getPendudukById(
    validatedData.penduduk_id
  );

  // Insert data dengan admin_id = user.id dan data_penduduk_snapshot
  const { data: newSurat, error } = await supabase
    .from("surat_keluar")
    .insert({
      ...validatedData,
      admin_id: user.id,
      data_penduduk_snapshot: pendudukData || null,
    } as Record<string, any>)
    .select()
    .single();

  if (error) {
    console.error("Error creating surat keluar:", error);
    return { error: error.message || "Gagal membuat data surat keluar" };
  }

  revalidatePath("/surat-keluar");
  return { data: newSurat, error: null };
}

/**
 * Update Surat Keluar
 */
export async function updateSuratKeluar(data: UpdateSuratKeluarData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = updateSuratKeluarSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Check Nomor Surat duplicate (jika Nomor Surat diubah)
  if (updateData.nomor_surat) {
    const { data: existingSurat } = await supabase
      .from("surat_keluar")
      .select("id")
      .eq("nomor_surat", updateData.nomor_surat)
      .neq("id", id)
      .single();

    if (existingSurat) {
      return { error: "Nomor surat sudah terdaftar" };
    }
  }

  // Update snapshot jika penduduk_id diubah
  if (updateData.penduduk_id) {
    const { data: pendudukData } = await getPendudukById(
      updateData.penduduk_id
    );
    updateData.data_penduduk_snapshot = pendudukData || null;
  }

  // Update data
  const { data: updatedSurat, error } = await supabase
    .from("surat_keluar")
    .update(updateData as Record<string, any>)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating surat keluar:", error);
    return { error: error.message || "Gagal mengupdate data surat keluar" };
  }

  revalidatePath("/surat-keluar");
  revalidatePath(`/surat-keluar/${id}`);
  return { data: updatedSurat, error: null };
}

/**
 * Delete Surat Keluar
 */
export async function deleteSuratKeluar(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Delete data
  const { error } = await supabase.from("surat_keluar").delete().eq("id", id);

  if (error) {
    console.error("Error deleting surat keluar:", error);
    return { error: error.message || "Gagal menghapus data surat keluar" };
  }

  revalidatePath("/surat-keluar");
  return { error: null };
}

/**
 * Get Surat Keluar List dengan Pagination
 */
export async function getSuratKeluarList(params: {
  page?: number;
  limit?: number;
  search?: string;
  jenis_surat?: string;
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
    .from("surat_keluar")
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
    .order("tanggal_cetak", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filter by jenis_surat
  if (params.jenis_surat) {
    query = query.eq("jenis_surat", params.jenis_surat);
  }

  // Filter by penduduk_id
  if (params.penduduk_id) {
    query = query.eq("penduduk_id", params.penduduk_id);
  }

  // Search by nomor_surat
  if (params.search && params.search.trim()) {
    const searchTerm = params.search.trim();
    query = query.ilike("nomor_surat", `%${searchTerm}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    const errorInfo = {
      message: error.message || "Unknown error",
      details: error.details || "No details",
      hint: error.hint || "No hint",
      code: error.code || "No code",
    };

    console.error("Error fetching surat keluar list:", errorInfo);
    console.error("Full error object:", error);

    const errorMessage =
      error.message ||
      error.details ||
      error.hint ||
      "Gagal mengambil data surat keluar";

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
 * Get Surat Keluar by ID
 */
export async function getSuratKeluarById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surat_keluar")
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
    console.error("Error fetching surat keluar:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
