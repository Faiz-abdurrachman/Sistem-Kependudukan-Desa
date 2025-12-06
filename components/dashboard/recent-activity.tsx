/**
 * Recent Activity Component
 * Menampilkan aktivitas terbaru (mutasi & surat)
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Activity, FileText } from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  recentMutasi: any[];
  recentSurat: any[];
}

export function RecentActivity({
  recentMutasi,
  recentSurat,
}: RecentActivityProps) {
  const getJenisMutasiBadge = (jenis: string) => {
    const badges: Record<string, string> = {
      LAHIR: "bg-green-500/20 text-green-300",
      MATI: "bg-red-500/20 text-red-300",
      PINDAH_DATANG: "bg-blue-500/20 text-blue-300",
      PINDAH_KELUAR: "bg-orange-500/20 text-orange-300",
    };
    return badges[jenis] || "bg-gray-500/20 text-gray-300";
  };

  return (
    <>
      {/* Recent Mutasi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Mutasi Terbaru
          </CardTitle>
          <Link href="/mutasi" className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
        </CardHeader>
        <CardContent>
          {recentMutasi.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              Belum ada mutasi terbaru
            </p>
          ) : (
            <div className="space-y-3">
              {recentMutasi.map((mutasi: any) => {
                const penduduk = mutasi.penduduk as any;
                return (
                  <Link
                    key={mutasi.id}
                    href={`/mutasi/${mutasi.id}`}
                    className="block p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getJenisMutasiBadge(
                              mutasi.jenis_mutasi
                            )}`}
                          >
                            {mutasi.jenis_mutasi.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium">
                          {penduduk
                            ? `${penduduk.nik} - ${penduduk.nama_lengkap}`
                            : "Penduduk tidak ditemukan"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {format(
                            new Date(mutasi.tanggal_peristiwa),
                            "dd MMM yyyy",
                            { locale: id }
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Surat */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Surat Terbaru
          </CardTitle>
          <Link
            href="/surat-keluar"
            className="text-sm text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </CardHeader>
        <CardContent>
          {recentSurat.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              Belum ada surat terbaru
            </p>
          ) : (
            <div className="space-y-3">
              {recentSurat.map((surat: any) => {
                const penduduk = surat.penduduk as any;
                return (
                  <Link
                    key={surat.id}
                    href={`/surat-keluar/${surat.id}`}
                    className="block p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                            {surat.jenis_surat}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium">
                          {surat.nomor_surat}
                        </p>
                        <p className="text-xs text-slate-300 mt-1">
                          {penduduk
                            ? `${penduduk.nik} - ${penduduk.nama_lengkap}`
                            : "Penduduk tidak ditemukan"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {format(
                            new Date(surat.tanggal_cetak),
                            "dd MMM yyyy",
                            { locale: id }
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
