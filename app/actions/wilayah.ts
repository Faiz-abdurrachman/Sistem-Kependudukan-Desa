/**
 * Server Actions untuk CRUD Wilayah
 * Wilayah adalah hierarki administratif: Desa → Dusun → RW → RT
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createWilayahSchema,
  updateWilayahSchema,
  type CreateWilayahData,
  type UpdateWilayahData,
} from "@/lib/validations/wilayah";

/**
 * Create Wilayah Baru
 */
export async function createWilayah(data: CreateWilayahData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = createWilayahSchema.parse(data);

  // Check kombinasi dusun/rw/rt harus unik
  const { data: existingWilayah } = await supabase
    .from("wilayah")
    .select("id")
    .eq("dusun", validatedData.dusun)
    .eq("rw", validatedData.rw || null)
    .eq("rt", validatedData.rt || null)
    .single();

  if (existingWilayah) {
    return {
      error: "Kombinasi Dusun/RW/RT sudah terdaftar",
    };
  }

  // Insert data
  const { data: newWilayah, error } = await supabase
    .from("wilayah")
    .insert(validatedData as Record<string, any>)
    .select()
    .single();

  if (error) {
    console.error("Error creating wilayah:", error);
    return { error: error.message || "Gagal membuat data wilayah" };
  }

  revalidatePath("/wilayah");
  return { data: newWilayah, error: null };
}

/**
 * Update Wilayah
 */
export async function updateWilayah(data: UpdateWilayahData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedData = updateWilayahSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Check kombinasi dusun/rw/rt harus unik (jika diubah)
  if (
    updateData.dusun ||
    updateData.rw !== undefined ||
    updateData.rt !== undefined
  ) {
    const finalDusun = updateData.dusun || validatedData.dusun;
    const finalRw =
      updateData.rw !== undefined ? updateData.rw : validatedData.rw;
    const finalRt =
      updateData.rt !== undefined ? updateData.rt : validatedData.rt;

    const { data: existingWilayah } = await supabase
      .from("wilayah")
      .select("id")
      .eq("dusun", finalDusun)
      .eq("rw", finalRw || null)
      .eq("rt", finalRt || null)
      .neq("id", id)
      .single();

    if (existingWilayah) {
      return {
        error: "Kombinasi Dusun/RW/RT sudah terdaftar",
      };
    }
  }

  // Update data
  const { data: updatedWilayah, error } = await supabase
    .from("wilayah")
    .update(updateData as Record<string, any>)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating wilayah:", error);
    return { error: error.message || "Gagal mengupdate data wilayah" };
  }

  revalidatePath("/wilayah");
  revalidatePath(`/wilayah/${id}`);
  return { data: updatedWilayah, error: null };
}

/**
 * Delete Wilayah
 */
export async function deleteWilayah(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check apakah ada KK yang menggunakan wilayah ini
  const { count: kkCount } = await supabase
    .from("kartu_keluarga")
    .select("id", { count: "exact", head: true })
    .eq("wilayah_id", id);

  if (kkCount && kkCount > 0) {
    return {
      error:
        "Tidak bisa menghapus wilayah yang masih digunakan oleh Kartu Keluarga",
    };
  }

  // Delete data
  const { error } = await supabase.from("wilayah").delete().eq("id", id);

  if (error) {
    console.error("Error deleting wilayah:", error);
    return { error: error.message || "Gagal menghapus data wilayah" };
  }

  revalidatePath("/wilayah");
  return { error: null };
}

/**
 * Get Wilayah List dengan Pagination
 */
export async function getWilayahList(params: {
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
    .from("wilayah")
    .select("*", { count: "exact" })
    .order("dusun", { ascending: true })
    .order("rw", { ascending: true })
    .order("rt", { ascending: true })
    .range(from, to);

  // Search by dusun, rw, rt, atau nama_desa
  if (params.search && params.search.trim()) {
    const searchTerm = `%${params.search.trim()}%`;
    query = query.or(
      `dusun.ilike.${searchTerm},rw.ilike.${searchTerm},rt.ilike.${searchTerm},nama_desa.ilike.${searchTerm}`
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

    console.error("Error fetching wilayah list:", errorInfo);
    console.error("Full error object:", error);

    const errorMessage =
      error.message ||
      error.details ||
      error.hint ||
      "Gagal mengambil data wilayah";

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
 * Get Wilayah by ID
 */
export async function getWilayahById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wilayah")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: data as {
      id: string;
      dusun: string;
      rw: string | null;
      rt: string | null;
      nama_desa: string | null;
      nama_kecamatan: string | null;
      nama_kabupaten: string | null;
      nama_provinsi: string | null;
      created_at: string;
      updated_at: string | null;
    },
    error: null,
  };
}

/**
 * Get Wilayah List (untuk dropdown)
 */
export async function getWilayahListForDropdown() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("wilayah")
    .select("id, dusun, rw, rt")
    .order("dusun", { ascending: true })
    .order("rw", { ascending: true })
    .order("rt", { ascending: true });

  if (error) {
    console.error("Error fetching wilayah list:", error);
    return { data: [], error: error.message };
  }

  // Format untuk dropdown: "Dusun X, RW Y, RT Z"
  const formattedData =
    data?.map((w) => ({
      id: w.id,
      label: `${w.dusun}${w.rw ? `, RW ${w.rw}` : ""}${
        w.rt ? `, RT ${w.rt}` : ""
      }`,
      dusun: w.dusun,
      rw: w.rw,
      rt: w.rt,
    })) || [];

  return { data: formattedData, error: null };
}

/**
 * Import Wilayah dari Excel/CSV
 */
export async function importWilayah(data: any[]) {
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
      const wilayahData: any = {
        dusun: row["dusun"] || row["Dusun"],
        rw: row["rw"] || row["RW"] || null,
        rt: row["rt"] || row["RT"] || null,
        nama_desa: row["nama_desa"] || row["Nama Desa"] || row["Desa"] || null,
        nama_kecamatan:
          row["nama_kecamatan"] ||
          row["Nama Kecamatan"] ||
          row["Kecamatan"] ||
          null,
        nama_kabupaten:
          row["nama_kabupaten"] ||
          row["Nama Kabupaten"] ||
          row["Kabupaten"] ||
          null,
        nama_provinsi:
          row["nama_provinsi"] ||
          row["Nama Provinsi"] ||
          row["Provinsi"] ||
          null,
      };

      // Validate
      const validatedData = createWilayahSchema.parse(wilayahData);

      // Check kombinasi unik
      const { data: existing } = await supabase
        .from("wilayah")
        .select("id")
        .eq("dusun", validatedData.dusun)
        .eq("rw", validatedData.rw || null)
        .eq("rt", validatedData.rt || null)
        .single();

      if (existing) {
        errors.push(`Baris ${i + 2}: Kombinasi Dusun/RW/RT sudah terdaftar`);
        continue;
      }

      // Insert
      const { error } = await supabase
        .from("wilayah")
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
    revalidatePath("/wilayah");
  }

  return { success, errors };
}
