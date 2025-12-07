/**
 * Dashboard Page - Enhanced dengan Charts & Statistics
 * Halaman utama dengan data lengkap dan visualisasi
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Home,
  TrendingUp,
  FileText,
  MapPin,
  Activity,
} from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get dashboard statistics with error handling
  let statsResult;
  try {
    statsResult = await getDashboardStats();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    statsResult = { error: "Failed to load statistics" };
  }

  const stats = statsResult?.data || {
    totalPenduduk: 0,
    totalPendudukAll: 0,
    totalPendudukMati: 0,
    totalPendudukPindah: 0,
    totalKK: 0,
    totalWilayah: 0,
    mutasiBulanIni: 0,
    mutasiCounts: { LAHIR: 0, MATI: 0, PINDAH_DATANG: 0, PINDAH_KELUAR: 0 },
    suratBulanIni: 0,
    suratCounts: {},
    jkCounts: { "LAKI-LAKI": 0, PEREMPUAN: 0 },
    recentMutasi: [],
    recentSurat: [],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang</h1>
          <p className="text-slate-200 font-medium">
            Halo, <span className="font-semibold text-white">{user.email}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
          <p className="text-sm text-slate-400">
            {format(new Date(), "HH:mm", { locale: id })} WIB
          </p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Total Penduduk
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalPenduduk.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              {stats.totalPendudukMati > 0 && (
                <span className="text-red-400">
                  {stats.totalPendudukMati} Meninggal,{" "}
                </span>
              )}
              {stats.totalPendudukPindah > 0 && (
                <span className="text-orange-400">
                  {stats.totalPendudukPindah} Pindah
                </span>
              )}
              {stats.totalPendudukMati === 0 &&
                stats.totalPendudukPindah === 0 && (
                  <span>Data penduduk aktif</span>
                )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Total Kartu Keluarga
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/30 flex items-center justify-center">
              <Home className="h-5 w-5 text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalKK.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Kartu Keluarga terdaftar
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Mutasi Bulan Ini
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-500/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.mutasiBulanIni.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              {stats.mutasiCounts.LAHIR > 0 && (
                <span className="text-green-400">
                  {stats.mutasiCounts.LAHIR} Lahir,{" "}
                </span>
              )}
              {stats.mutasiCounts.MATI > 0 && (
                <span className="text-red-400">
                  {stats.mutasiCounts.MATI} Meninggal
                </span>
              )}
              {stats.mutasiCounts.LAHIR === 0 &&
                stats.mutasiCounts.MATI === 0 && (
                  <span>Lahir, Mati, Pindah</span>
                )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Surat Dicetak
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.suratBulanIni.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-300 font-semibold">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Total Wilayah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalWilayah.toLocaleString("id-ID")}
            </div>
            <p className="text-sm text-slate-400 mt-1">Dusun/RW/RT</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Komposisi Penduduk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Laki-Laki</span>
                <span className="text-white font-semibold">
                  {stats.jkCounts["LAKI-LAKI"].toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Perempuan</span>
                <span className="text-white font-semibold">
                  {stats.jkCounts.PEREMPUAN.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Penduduk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Hidup</span>
                <span className="text-green-400 font-semibold">
                  {stats.totalPenduduk.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Mati</span>
                <span className="text-red-400 font-semibold">
                  {stats.totalPendudukMati.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Pindah</span>
                <span className="text-orange-400 font-semibold">
                  {stats.totalPendudukPindah.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts
        mutasiCounts={stats.mutasiCounts}
        suratCounts={stats.suratCounts}
        jkCounts={stats.jkCounts}
      />

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity
          recentMutasi={stats.recentMutasi}
          recentSurat={stats.recentSurat}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Aksi Cepat</CardTitle>
          <CardDescription className="text-slate-300">
            Akses cepat ke fitur utama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/penduduk/create">
              <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer border-slate-700">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm font-semibold text-white">
                    Tambah Penduduk
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/kartu-keluarga/create">
              <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer border-slate-700">
                <CardContent className="p-4 text-center">
                  <Home className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-semibold text-white">Tambah KK</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/mutasi/create">
              <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer border-slate-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                  <p className="text-sm font-semibold text-white">
                    Catat Mutasi
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/surat-keluar/create">
              <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer border-slate-700">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-semibold text-white">Buat Surat</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
