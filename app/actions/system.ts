/**
 * Server Actions untuk System Operations
 * Export All Data, Backup Database, dll
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { getPendudukList } from "./penduduk";
import { getKartuKeluargaList } from "./kartu-keluarga";
import { getWilayahList } from "./wilayah";
import { getMutasiList } from "./mutasi";
import { getSuratKeluarList } from "./surat-keluar";
import * as XLSX from "xlsx";

/**
 * Export All Data ke Excel
 * Export semua data dari semua modul ke 1 file Excel dengan multiple sheets
 */
export async function exportAllData() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Fetch semua data
    const [pendudukResult, kkResult, wilayahResult, mutasiResult, suratResult] =
      await Promise.all([
        getPendudukList({ page: 1, limit: 10000 }),
        getKartuKeluargaList({ page: 1, limit: 10000 }),
        getWilayahList({ page: 1, limit: 10000 }),
        getMutasiList({ page: 1, limit: 10000 }),
        getSuratKeluarList({ page: 1, limit: 10000 }),
      ]);

    // Format data untuk export
    const pendudukData = (pendudukResult.data || []).map((p: any) => ({
      NIK: p.nik,
      "Nama Lengkap": p.nama_lengkap,
      "Tempat Lahir": p.tempat_lahir || "-",
      "Tanggal Lahir": p.tgl_lahir || "-",
      "Jenis Kelamin": p.jenis_kelamin,
      "Golongan Darah": p.gol_darah || "-",
      Agama: p.agama,
      "Status Kawin": p.status_kawin,
      SHDK: p.shdk,
      Pendidikan: p.pendidikan,
      Pekerjaan: p.pekerjaan || "-",
      "Status Dasar": p.status_dasar,
    }));

    const kkData = (kkResult.data || []).map((kk: any) => ({
      "Nomor KK": kk.nomor_kk,
      "Alamat Lengkap": kk.alamat_lengkap,
      Wilayah: kk.wilayah
        ? `${kk.wilayah.dusun}${kk.wilayah.rw ? `, RW ${kk.wilayah.rw}` : ""}${
            kk.wilayah.rt ? `, RT ${kk.wilayah.rt}` : ""
          }`
        : "-",
      "Kepala Keluarga": kk.kepala_keluarga
        ? `${kk.kepala_keluarga.nik} - ${kk.kepala_keluarga.nama_lengkap}`
        : "-",
    }));

    const wilayahData = (wilayahResult.data || []).map((w: any) => ({
      Dusun: w.dusun,
      RW: w.rw || "-",
      RT: w.rt || "-",
      "Nama Desa": w.nama_desa || "-",
      Kecamatan: w.nama_kecamatan || "-",
      Kabupaten: w.nama_kabupaten || "-",
      Provinsi: w.nama_provinsi || "-",
    }));

    const mutasiData = (mutasiResult.data || []).map((m: any) => ({
      "Tanggal Peristiwa": m.tanggal_peristiwa || "-",
      "Jenis Mutasi": m.jenis_mutasi,
      "NIK Penduduk": m.penduduk?.nik || "-",
      "Nama Penduduk": m.penduduk?.nama_lengkap || "-",
      Keterangan: m.keterangan || "-",
    }));

    const suratData = (suratResult.data || []).map((s: any) => ({
      "Nomor Surat": s.nomor_surat,
      "Jenis Surat": s.jenis_surat,
      "Tanggal Cetak": s.tanggal_cetak || "-",
      "NIK Penduduk": s.penduduk?.nik || "-",
      "Nama Penduduk": s.penduduk?.nama_lengkap || "-",
    }));

    // Create workbook dengan multiple sheets
    const workbook = XLSX.utils.book_new();

    // Add sheets
    if (pendudukData.length > 0) {
      const ws1 = XLSX.utils.json_to_sheet(pendudukData);
      XLSX.utils.book_append_sheet(workbook, ws1, "Penduduk");
    }

    if (kkData.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(kkData);
      XLSX.utils.book_append_sheet(workbook, ws2, "Kartu Keluarga");
    }

    if (wilayahData.length > 0) {
      const ws3 = XLSX.utils.json_to_sheet(wilayahData);
      XLSX.utils.book_append_sheet(workbook, ws3, "Wilayah");
    }

    if (mutasiData.length > 0) {
      const ws4 = XLSX.utils.json_to_sheet(mutasiData);
      XLSX.utils.book_append_sheet(workbook, ws4, "Mutasi");
    }

    if (suratData.length > 0) {
      const ws5 = XLSX.utils.json_to_sheet(suratData);
      XLSX.utils.book_append_sheet(workbook, ws5, "Surat Keluar");
    }

    // Convert to buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Convert buffer to base64
    const base64 = excelBuffer.toString("base64");

    return {
      data: base64,
      filename: `backup-all-data-${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
      error: null,
    };
  } catch (error: any) {
    console.error("Error exporting all data:", error);
    return {
      error: error.message || "Gagal mengexport semua data",
    };
  }
}

/**
 * Backup Database
 * Export semua data ke JSON untuk backup
 */
export async function backupDatabase() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Fetch semua data
    const [pendudukResult, kkResult, wilayahResult, mutasiResult, suratResult] =
      await Promise.all([
        getPendudukList({ page: 1, limit: 10000 }),
        getKartuKeluargaList({ page: 1, limit: 10000 }),
        getWilayahList({ page: 1, limit: 10000 }),
        getMutasiList({ page: 1, limit: 10000 }),
        getSuratKeluarList({ page: 1, limit: 10000 }),
      ]);

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      exported_by: user.email,
      data: {
        penduduk: pendudukResult.data || [],
        kartu_keluarga: kkResult.data || [],
        wilayah: wilayahResult.data || [],
        mutasi: mutasiResult.data || [],
        surat_keluar: suratResult.data || [],
      },
      metadata: {
        totalPenduduk: pendudukResult.count || 0,
        totalKK: kkResult.count || 0,
        totalWilayah: wilayahResult.count || 0,
        totalMutasi: mutasiResult.count || 0,
        totalSurat: suratResult.count || 0,
      },
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(backup, null, 2);

    // Convert to base64
    const base64 = Buffer.from(jsonString, "utf-8").toString("base64");

    return {
      data: base64,
      filename: `backup-database-${
        new Date().toISOString().split("T")[0]
      }.json`,
      error: null,
    };
  } catch (error: any) {
    console.error("Error backing up database:", error);
    return {
      error: error.message || "Gagal membuat backup database",
    };
  }
}
