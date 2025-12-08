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

/**
 * Import Surat Keluar dari Excel/CSV
 */
export async function importSuratKeluar(data: any[]) {
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
      // Map column names (flexible)
      const suratData: any = {
        penduduk_id:
          row["penduduk_id"] || row["Penduduk ID"] || row["ID Penduduk"],
        jenis_surat: row["jenis_surat"] || row["Jenis Surat"] || row["Jenis"],
        nomor_surat:
          row["nomor_surat"] || row["Nomor Surat"] || row["No Surat"],
        tanggal_cetak:
          row["tanggal_cetak"] || row["Tanggal Cetak"] || row["Tanggal"],
        keterangan: row["keterangan"] || row["Keterangan"] || null,
      };

      // Convert tanggal ke format YYYY-MM-DD
      if (suratData.tanggal_cetak) {
        if (typeof suratData.tanggal_cetak === "string") {
          // Jika sudah format YYYY-MM-DD, gunakan langsung
          if (!/^\d{4}-\d{2}-\d{2}$/.test(suratData.tanggal_cetak)) {
            // Convert dari Date object atau format lain
            const date = new Date(suratData.tanggal_cetak);
            suratData.tanggal_cetak = date.toISOString().split("T")[0];
          }
        } else if (suratData.tanggal_cetak instanceof Date) {
          suratData.tanggal_cetak = suratData.tanggal_cetak
            .toISOString()
            .split("T")[0];
        }
      }

      // Validate
      const validatedData = createSuratKeluarSchema.parse(suratData);

      // Get penduduk data untuk snapshot
      const { data: pendudukData } = await getPendudukById(
        validatedData.penduduk_id
      );

      validData.push({
        ...validatedData,
        _rowIndex: i + 2,
        _pendudukData: pendudukData,
      });
    } catch (error: any) {
      errors.push(`Baris ${i + 2}: ${error.message || "Data tidak valid"}`);
    }
  }

  // Step 2: Get all existing nomor_surat untuk check duplicate
  if (validData.length > 0) {
    const allNomorSurat = validData.map((d) => d.nomor_surat);
    const { data: existingSurat } = await supabase
      .from("surat_keluar")
      .select("nomor_surat")
      .in("nomor_surat", allNomorSurat);

    const existingSet = new Set(
      (existingSurat || []).map((s) => s.nomor_surat)
    );

    // Step 3: Filter out duplicates
    const toInsert = validData.filter((data) => {
      if (existingSet.has(data.nomor_surat)) {
        errors.push(
          `Baris ${data._rowIndex}: Nomor surat ${data.nomor_surat} sudah terdaftar`
        );
        return false;
      }
      existingSet.add(data.nomor_surat);
      return true;
    });

    // Step 4: Batch insert
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const insertData = batch.map(({ _rowIndex, _pendudukData, ...data }) => ({
        ...data,
        admin_id: user.id,
        data_penduduk_snapshot: _pendudukData || null,
        // tanggal_cetak sudah dalam format string YYYY-MM-DD dari validation
      }));

      const { error } = await supabase
        .from("surat_keluar")
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
    revalidatePath("/surat-keluar");
  }

  return { success, errors };
}
