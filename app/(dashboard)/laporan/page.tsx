/**
 * Laporan Page
 * Halaman untuk generate dan download laporan
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getPendudukList } from "@/app/actions/penduduk";
import { getMutasiList } from "@/app/actions/mutasi";
import { getSuratKeluarList } from "@/app/actions/surat-keluar";
import { ReportGenerator } from "@/components/reports/report-generator";

export default async function LaporanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get data untuk laporan
  const statsResult = await getDashboardStats();
  const stats = statsResult.data || {
    totalPenduduk: 0,
    totalKK: 0,
    mutasiBulanIni: 0,
    suratBulanIni: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Laporan</h1>
        <p className="text-slate-200 font-medium">
          Generate dan download laporan data kependudukan
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Penduduk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalPenduduk.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total KK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalKK.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Mutasi Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.mutasiBulanIni.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Surat Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.suratBulanIni.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <ReportGenerator />
    </div>
  );
}
