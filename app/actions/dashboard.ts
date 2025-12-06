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
    // Get Total Penduduk (HIDUP)
    const { count: totalPenduduk } = await supabase
      .from("penduduk")
      .select("id", { count: "exact", head: true })
      .eq("status_dasar", "HIDUP");

    // Get Total Penduduk (SEMUA STATUS)
    const { count: totalPendudukAll } = await supabase
      .from("penduduk")
      .select("id", { count: "exact", head: true });

    // Get Total Penduduk MATI
    const { count: totalPendudukMati } = await supabase
      .from("penduduk")
      .select("id", { count: "exact", head: true })
      .eq("status_dasar", "MATI");

    // Get Total Penduduk PINDAH
    const { count: totalPendudukPindah } = await supabase
      .from("penduduk")
      .select("id", { count: "exact", head: true })
      .eq("status_dasar", "PINDAH");

    // Get Total Kartu Keluarga
    const { count: totalKK } = await supabase
      .from("kartu_keluarga")
      .select("id", { count: "exact", head: true });

    // Get Total Wilayah
    const { count: totalWilayah } = await supabase
      .from("wilayah")
      .select("id", { count: "exact", head: true });

    // Get Mutasi Bulan Ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfMonthStr = startOfMonth.toISOString().split("T")[0];
    const endOfMonthStr = endOfMonth.toISOString().split("T")[0];

    const { count: mutasiBulanIni } = await supabase
      .from("mutasi_log")
      .select("id", { count: "exact", head: true })
      .gte("tanggal_peristiwa", startOfMonthStr)
      .lte("tanggal_peristiwa", endOfMonthStr);

    // Get Mutasi per Jenis (Bulan Ini)
    const { data: mutasiPerJenis } = await supabase
      .from("mutasi_log")
      .select("jenis_mutasi")
      .gte("tanggal_peristiwa", startOfMonthStr)
      .lte("tanggal_peristiwa", endOfMonthStr);

    const mutasiCounts = {
      LAHIR: 0,
      MATI: 0,
      PINDAH_DATANG: 0,
      PINDAH_KELUAR: 0,
    };

    mutasiPerJenis?.forEach((m) => {
      if (m.jenis_mutasi in mutasiCounts) {
        mutasiCounts[m.jenis_mutasi as keyof typeof mutasiCounts]++;
      }
    });

    // Get Surat Dicetak Bulan Ini
    const { count: suratBulanIni } = await supabase
      .from("surat_keluar")
      .select("id", { count: "exact", head: true })
      .gte("tanggal_cetak", startOfMonthStr)
      .lte("tanggal_cetak", endOfMonthStr);

    // Get Surat per Jenis (Bulan Ini)
    const { data: suratPerJenis } = await supabase
      .from("surat_keluar")
      .select("jenis_surat")
      .gte("tanggal_cetak", startOfMonthStr)
      .lte("tanggal_cetak", endOfMonthStr);

    const suratCounts: Record<string, number> = {};
    suratPerJenis?.forEach((s) => {
      suratCounts[s.jenis_surat] = (suratCounts[s.jenis_surat] || 0) + 1;
    });

    // Get Penduduk per Jenis Kelamin
    const { data: pendudukPerJK } = await supabase
      .from("penduduk")
      .select("jenis_kelamin")
      .eq("status_dasar", "HIDUP");

    const jkCounts = {
      "LAKI-LAKI": 0,
      PEREMPUAN: 0,
    };

    pendudukPerJK?.forEach((p) => {
      if (p.jenis_kelamin === "LAKI-LAKI") jkCounts["LAKI-LAKI"]++;
      if (p.jenis_kelamin === "PEREMPUAN") jkCounts.PEREMPUAN++;
    });

    // Get Recent Mutasi (5 terakhir)
    const { data: recentMutasi } = await supabase
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
      .limit(5);

    // Get Recent Surat (5 terakhir)
    const { data: recentSurat } = await supabase
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
      .limit(5);

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
