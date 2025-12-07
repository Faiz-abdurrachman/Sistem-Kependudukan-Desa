// @ts-nocheck - Temporary workaround for Supabase type inference issues
/**
 * Server Actions untuk Generate Reports
 * Generate berbagai jenis laporan dari database
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { getPendudukList } from "./penduduk";
import { getMutasiList } from "./mutasi";
import { getSuratKeluarList } from "./surat-keluar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as XLSX from "xlsx";

/**
 * Generate Report Penduduk
 */
export async function generateReportPenduduk(
  jenis: string,
  wilayahId?: string
) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    let pendudukData: any[] = [];

    switch (jenis) {
      case "penduduk-all":
        const allResult = await getPendudukList({
          page: 1,
          limit: 10000,
        });
        pendudukData = allResult.data || [];
        break;

      case "penduduk-hidup":
        const hidupResult = await getPendudukList({
          page: 1,
          limit: 10000,
          status_dasar: "HIDUP",
        });
        pendudukData = hidupResult.data || [];
        break;

      case "penduduk-mati":
        const matiResult = await getPendudukList({
          page: 1,
          limit: 10000,
          status_dasar: "MATI",
        });
        pendudukData = matiResult.data || [];
        break;

      case "penduduk-pindah":
        const pindahResult = await getPendudukList({
          page: 1,
          limit: 10000,
          status_dasar: "PINDAH",
        });
        pendudukData = pindahResult.data || [];
        break;

      case "penduduk-per-wilayah":
        const wilayahResult = await getPendudukList({
          page: 1,
          limit: 10000,
        });
        pendudukData = wilayahResult.data || [];
        if (wilayahId) {
          // Filter by wilayah if provided
          const { data: kkList } = await supabase
            .from("kartu_keluarga")
            .select("id")
            .eq("wilayah_id", wilayahId);
          const kkIds = kkList?.map((kk) => kk.id) || [];
          pendudukData = pendudukData.filter((p) => kkIds.includes(p.kk_id));
        }
        break;

      default:
        return { error: "Jenis laporan tidak valid" };
    }

    // Check if data is empty
    if (!pendudukData || pendudukData.length === 0) {
      return {
        error:
          "Tidak ada data untuk jenis laporan ini. Pastikan sudah ada data di database.",
      };
    }

    // Format data untuk export
    const formattedData = pendudukData.map((p: any) => ({
      NIK: p.nik || "-",
      "Nama Lengkap": p.nama_lengkap || "-",
      "Tempat Lahir": p.tempat_lahir || "-",
      "Tanggal Lahir": p.tgl_lahir || "-",
      "Jenis Kelamin": p.jenis_kelamin || "-",
      "Golongan Darah": p.gol_darah || "-",
      Agama: p.agama || "-",
      "Status Kawin": p.status_kawin || "-",
      SHDK: p.shdk || "-",
      Pendidikan: p.pendidikan || "-",
      Pekerjaan: p.pekerjaan || "-",
      "Status Dasar": p.status_dasar || "-",
    }));

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penduduk");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const base64 = excelBuffer.toString("base64");
    const jenisLabel =
      jenis === "penduduk-all"
        ? "Semua Penduduk"
        : jenis === "penduduk-hidup"
        ? "Penduduk Hidup"
        : jenis === "penduduk-mati"
        ? "Penduduk Meninggal"
        : jenis === "penduduk-pindah"
        ? "Penduduk Pindah"
        : "Penduduk per Wilayah";

    return {
      data: base64,
      filename: `laporan-${jenis}-${format(new Date(), "yyyy-MM-dd", {
        locale: id,
      })}.xlsx`,
      jenis: jenisLabel,
      count: formattedData.length,
      error: null,
    };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return {
      error: error.message || "Gagal generate laporan",
    };
  }
}

/**
 * Generate Report Mutasi
 */
export async function generateReportMutasi(jenis: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    let mutasiData: any[] = [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (jenis) {
      case "mutasi-bulanan":
        const bulananResult = await getMutasiList({
          page: 1,
          limit: 10000,
        });
        mutasiData =
          (bulananResult.data || []).filter(
            (m: any) => new Date(m.tanggal_peristiwa) >= startOfMonth
          ) || [];
        break;

      case "mutasi-tahunan":
        const tahunanResult = await getMutasiList({
          page: 1,
          limit: 10000,
        });
        mutasiData =
          (tahunanResult.data || []).filter(
            (m: any) => new Date(m.tanggal_peristiwa) >= startOfYear
          ) || [];
        break;

      case "mutasi-lahir":
        const lahirResult = await getMutasiList({
          page: 1,
          limit: 10000,
          jenis_mutasi: "LAHIR",
        });
        mutasiData = lahirResult.data || [];
        break;

      case "mutasi-mati":
        const matiResult = await getMutasiList({
          page: 1,
          limit: 10000,
          jenis_mutasi: "MATI",
        });
        mutasiData = matiResult.data || [];
        break;

      case "mutasi-pindah":
        const pindahResult = await getMutasiList({
          page: 1,
          limit: 10000,
        });
        mutasiData =
          (pindahResult.data || []).filter(
            (m: any) =>
              m.jenis_mutasi === "PINDAH_DATANG" ||
              m.jenis_mutasi === "PINDAH_KELUAR"
          ) || [];
        break;

      default:
        return { error: "Jenis laporan tidak valid" };
    }

    // Check if data is empty
    if (!mutasiData || mutasiData.length === 0) {
      return {
        error:
          "Tidak ada data mutasi untuk jenis laporan ini. Pastikan sudah ada data mutasi di database.",
      };
    }

    // Format data
    const formattedData = mutasiData.map((m: any) => ({
      "Tanggal Peristiwa": m.tanggal_peristiwa || "-",
      "Jenis Mutasi": m.jenis_mutasi || "-",
      "NIK Penduduk": m.penduduk?.nik || "-",
      "Nama Penduduk": m.penduduk?.nama_lengkap || "-",
      Keterangan: m.keterangan || "-",
    }));

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Mutasi");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const base64 = excelBuffer.toString("base64");
    const jenisLabel =
      jenis === "mutasi-bulanan"
        ? "Mutasi Bulanan"
        : jenis === "mutasi-tahunan"
        ? "Mutasi Tahunan"
        : jenis === "mutasi-lahir"
        ? "Laporan Kelahiran"
        : jenis === "mutasi-mati"
        ? "Laporan Kematian"
        : "Laporan Pindah";

    return {
      data: base64,
      filename: `laporan-${jenis}-${format(new Date(), "yyyy-MM-dd", {
        locale: id,
      })}.xlsx`,
      jenis: jenisLabel,
      count: formattedData.length,
      error: null,
    };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return {
      error: error.message || "Gagal generate laporan",
    };
  }
}

/**
 * Generate Report Surat Keluar
 */
export async function generateReportSurat(jenis: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    let suratData: any[] = [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (jenis) {
      case "surat-bulanan":
        const bulananResult = await getSuratKeluarList({
          page: 1,
          limit: 10000,
        });
        suratData =
          (bulananResult.data || []).filter(
            (s: any) => new Date(s.tanggal_cetak) >= startOfMonth
          ) || [];
        break;

      case "surat-tahunan":
        const tahunanResult = await getSuratKeluarList({
          page: 1,
          limit: 10000,
        });
        suratData =
          (tahunanResult.data || []).filter(
            (s: any) => new Date(s.tanggal_cetak) >= startOfYear
          ) || [];
        break;

      case "surat-per-jenis":
        const allResult = await getSuratKeluarList({
          page: 1,
          limit: 10000,
        });
        suratData = allResult.data || [];
        break;

      default:
        return { error: "Jenis laporan tidak valid" };
    }

    // Check if data is empty
    if (!suratData || suratData.length === 0) {
      return {
        error:
          "Tidak ada data surat untuk jenis laporan ini. Pastikan sudah ada data surat keluar di database.",
      };
    }

    // Format data
    const formattedData = suratData.map((s: any) => ({
      "Nomor Surat": s.nomor_surat || "-",
      "Jenis Surat": s.jenis_surat || "-",
      "Tanggal Cetak": s.tanggal_cetak || "-",
      "NIK Penduduk": s.penduduk?.nik || "-",
      "Nama Penduduk": s.penduduk?.nama_lengkap || "-",
    }));

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Surat");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const base64 = excelBuffer.toString("base64");
    const jenisLabel =
      jenis === "surat-bulanan"
        ? "Surat Bulanan"
        : jenis === "surat-tahunan"
        ? "Surat Tahunan"
        : "Surat per Jenis";

    return {
      data: base64,
      filename: `laporan-${jenis}-${format(new Date(), "yyyy-MM-dd", {
        locale: id,
      })}.xlsx`,
      jenis: jenisLabel,
      count: formattedData.length,
      error: null,
    };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return {
      error: error.message || "Gagal generate laporan",
    };
  }
}

/**
 * Generate Report Statistik
 */
export async function generateReportStatistik(jenis: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    let statsData: any[] = [];

    switch (jenis) {
      case "statistik-penduduk":
        const pendudukResult = await getPendudukList({
          page: 1,
          limit: 10000,
        });
        const penduduk = pendudukResult.data || [];

        // Group by status dasar
        const statusCounts: Record<string, number> = {};
        const jkCounts: Record<string, number> = {};
        const agamaCounts: Record<string, number> = {};

        penduduk.forEach((p: any) => {
          statusCounts[p.status_dasar] =
            (statusCounts[p.status_dasar] || 0) + 1;
          jkCounts[p.jenis_kelamin] = (jkCounts[p.jenis_kelamin] || 0) + 1;
          agamaCounts[p.agama] = (agamaCounts[p.agama] || 0) + 1;
        });

        statsData = [
          { Kategori: "Status Dasar", ...statusCounts },
          { Kategori: "Jenis Kelamin", ...jkCounts },
          { Kategori: "Agama", ...agamaCounts },
        ];
        break;

      case "statistik-demografi":
        const demografiResult = await getPendudukList({
          page: 1,
          limit: 10000,
        });
        const demografi = demografiResult.data || [];

        // Group by pendidikan, pekerjaan
        const pendidikanCounts: Record<string, number> = {};
        const pekerjaanCounts: Record<string, number> = {};

        demografi.forEach((p: any) => {
          pendidikanCounts[p.pendidikan] =
            (pendidikanCounts[p.pendidikan] || 0) + 1;
          if (p.pekerjaan) {
            pekerjaanCounts[p.pekerjaan] =
              (pekerjaanCounts[p.pekerjaan] || 0) + 1;
          }
        });

        statsData = [
          { Kategori: "Pendidikan", ...pendidikanCounts },
          { Kategori: "Pekerjaan", ...pekerjaanCounts },
        ];
        break;

      case "statistik-mutasi":
        const mutasiResult = await getMutasiList({
          page: 1,
          limit: 10000,
        });
        const mutasi = mutasiResult.data || [];

        const mutasiCounts: Record<string, number> = {};
        mutasi.forEach((m: any) => {
          mutasiCounts[m.jenis_mutasi] =
            (mutasiCounts[m.jenis_mutasi] || 0) + 1;
        });

        statsData = [{ Kategori: "Jenis Mutasi", ...mutasiCounts }];
        break;

      default:
        return { error: "Jenis laporan tidak valid" };
    }

    // Check if data is empty
    if (!statsData || statsData.length === 0) {
      return {
        error:
          "Tidak ada data statistik untuk jenis laporan ini. Pastikan sudah ada data di database.",
      };
    }

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(statsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistik");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const base64 = excelBuffer.toString("base64");
    const jenisLabel =
      jenis === "statistik-penduduk"
        ? "Statistik Penduduk"
        : jenis === "statistik-demografi"
        ? "Statistik Demografi"
        : "Statistik Mutasi";

    return {
      data: base64,
      filename: `laporan-${jenis}-${format(new Date(), "yyyy-MM-dd", {
        locale: id,
      })}.xlsx`,
      jenis: jenisLabel,
      count: statsData.length,
      error: null,
    };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return {
      error: error.message || "Gagal generate laporan",
    };
  }
}
