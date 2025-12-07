/**
 * Server Actions untuk Dashboard Statistics
 */

"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get Dashboard Statistics
 */
export async function getDashboardStats() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Run all count queries in parallel for better performance
    const [
      { count: totalPenduduk },
      { count: totalPendudukAll },
      { count: totalPendudukMati },
      { count: totalPendudukPindah },
      { count: totalKK },
      { count: totalWilayah },
    ] = await Promise.all([
      supabase
        .from("penduduk")
        .select("id", { count: "exact", head: true })
        .eq("status_dasar", "HIDUP"),
      supabase.from("penduduk").select("id", { count: "exact", head: true }),
      supabase
        .from("penduduk")
        .select("id", { count: "exact", head: true })
        .eq("status_dasar", "MATI"),
      supabase
        .from("penduduk")
        .select("id", { count: "exact", head: true })
        .eq("status_dasar", "PINDAH"),
      supabase
        .from("kartu_keluarga")
        .select("id", { count: "exact", head: true }),
      supabase.from("wilayah").select("id", { count: "exact", head: true }),
    ]);

    // Calculate date range once
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfMonthStr = startOfMonth.toISOString().split("T")[0];
    const endOfMonthStr = endOfMonth.toISOString().split("T")[0];

    // Run all monthly queries in parallel
    const [
      { count: mutasiBulanIni },
      { data: mutasiPerJenis },
      { count: suratBulanIni },
      { data: suratPerJenis },
      { data: pendudukPerJK },
      { data: recentMutasi },
      { data: recentSurat },
    ] = await Promise.all([
      supabase
        .from("mutasi_log")
        .select("id", { count: "exact", head: true })
        .gte("tanggal_peristiwa", startOfMonthStr)
        .lte("tanggal_peristiwa", endOfMonthStr),
      supabase
        .from("mutasi_log")
        .select("jenis_mutasi")
        .gte("tanggal_peristiwa", startOfMonthStr)
        .lte("tanggal_peristiwa", endOfMonthStr),
      supabase
        .from("surat_keluar")
        .select("id", { count: "exact", head: true })
        .gte("tanggal_cetak", startOfMonthStr)
        .lte("tanggal_cetak", endOfMonthStr),
      supabase
        .from("surat_keluar")
        .select("jenis_surat")
        .gte("tanggal_cetak", startOfMonthStr)
        .lte("tanggal_cetak", endOfMonthStr),
      supabase
        .from("penduduk")
        .select("jenis_kelamin")
        .eq("status_dasar", "HIDUP"),
      supabase
        .from("mutasi_log")
        .select(
          `
          *,
          penduduk:penduduk_id (
            nik,
            nama_lengkap
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("surat_keluar")
        .select(
          `
          *,
          penduduk:penduduk_id (
            nik,
            nama_lengkap
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // Process mutasi counts
    const mutasiCounts = {
      LAHIR: 0,
      MATI: 0,
      PINDAH_DATANG: 0,
      PINDAH_KELUAR: 0,
    };

    mutasiPerJenis?.forEach((m: any) => {
      if (m.jenis_mutasi in mutasiCounts) {
        mutasiCounts[m.jenis_mutasi as keyof typeof mutasiCounts]++;
      }
    });

    // Process surat counts
    const suratCounts: Record<string, number> = {};
    suratPerJenis?.forEach((s: any) => {
      suratCounts[s.jenis_surat] = (suratCounts[s.jenis_surat] || 0) + 1;
    });

    // Process jenis kelamin counts
    const jkCounts = {
      "LAKI-LAKI": 0,
      PEREMPUAN: 0,
    };

    pendudukPerJK?.forEach((p: any) => {
      if (p.jenis_kelamin === "LAKI-LAKI") jkCounts["LAKI-LAKI"]++;
      if (p.jenis_kelamin === "PEREMPUAN") jkCounts.PEREMPUAN++;
    });

    return {
      data: {
        totalPenduduk: totalPenduduk || 0,
        totalPendudukAll: totalPendudukAll || 0,
        totalPendudukMati: totalPendudukMati || 0,
        totalPendudukPindah: totalPendudukPindah || 0,
        totalKK: totalKK || 0,
        totalWilayah: totalWilayah || 0,
        mutasiBulanIni: mutasiBulanIni || 0,
        mutasiCounts,
        suratBulanIni: suratBulanIni || 0,
        suratCounts,
        jkCounts,
        recentMutasi: recentMutasi || [],
        recentSurat: recentSurat || [],
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return {
      error: error.message || "Gagal mengambil statistik dashboard",
      data: null,
    };
  }
}
