/**
 * Detail Mutasi Page
 * Halaman untuk melihat detail lengkap data mutasi
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getMutasiById } from "@/app/actions/mutasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DetailMutasiPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get mutasi data
  const { data: mutasi, error } = await getMutasiById(params.id);

  if (error || !mutasi) {
    redirect("/mutasi");
  }

  const mutasiData = mutasi as any;
  const penduduk = mutasiData.penduduk as any;

  // Helper untuk badge warna
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/mutasi">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Mutasi
            </h1>
            <p className="text-slate-200 font-medium">
              Informasi lengkap data mutasi
            </p>
          </div>
        </div>
        <Link href={`/mutasi/${params.id}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Data Mutasi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Data Mutasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Jenis Mutasi
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getJenisMutasiBadge(
                  mutasiData.jenis_mutasi
                )}`}
              >
                {mutasiData.jenis_mutasi.replace("_", " ")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Peristiwa
              </p>
              <p className="text-lg font-semibold text-white">
                {format(
                  new Date(mutasiData.tanggal_peristiwa),
                  "dd MMMM yyyy",
                  { locale: id }
                )}
              </p>
            </div>
            {mutasiData.keterangan && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Keterangan
                </p>
                <p className="text-lg font-semibold text-white">
                  {mutasiData.keterangan}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Penduduk */}
      {penduduk && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Data Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">NIK</p>
                <p className="text-lg font-semibold text-white">
                  {penduduk.nik}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Nama Lengkap
                </p>
                <p className="text-lg font-semibold text-white">
                  {penduduk.nama_lengkap}
                </p>
              </div>
              {penduduk.tempat_lahir && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Tempat/Tgl Lahir
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {penduduk.tempat_lahir},{" "}
                    {penduduk.tgl_lahir
                      ? format(new Date(penduduk.tgl_lahir), "dd MMMM yyyy", {
                          locale: id,
                        })
                      : ""}
                  </p>
                </div>
              )}
              {penduduk.jenis_kelamin && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Jenis Kelamin
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {penduduk.jenis_kelamin}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Dibuat Oleh
              </p>
              <p className="text-lg font-semibold text-white">
                User ID: {mutasiData.created_by?.substring(0, 8) || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Dibuat
              </p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(mutasiData.created_at), "dd MMMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
