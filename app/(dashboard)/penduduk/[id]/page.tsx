/**
 * Detail Penduduk Page
 * Halaman untuk melihat detail lengkap data penduduk
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPendudukById } from "@/app/actions/penduduk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DetailPendudukPage({
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

  // Get penduduk data
  const { data: penduduk, error } = await getPendudukById(params.id);

  if (error || !penduduk) {
    redirect("/penduduk");
  }

  const pendudukData = penduduk as any;
  const kk = pendudukData.kartu_keluarga as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/penduduk">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Penduduk
            </h1>
            <p className="text-slate-200 font-medium">
              Informasi lengkap data penduduk
            </p>
          </div>
        </div>
        <Link href={`/penduduk/${params.id}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Data Pribadi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Data Pribadi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">NIK</p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.nik}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nama Lengkap
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.nama_lengkap}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tempat Lahir
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.tempat_lahir}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Lahir
              </p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(pendudukData.tgl_lahir), "dd MMMM yyyy", {
                  locale: id,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Jenis Kelamin
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.jenis_kelamin}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Golongan Darah
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.gol_darah}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Agama</p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.agama}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Status Kawin
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.status_kawin}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Keluarga */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Data Keluarga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nomor Kartu Keluarga
              </p>
              <p className="text-lg font-semibold text-white">
                {kk?.nomor_kk || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Alamat Lengkap
              </p>
              <p className="text-lg font-semibold text-white">
                {kk?.alamat_lengkap || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">SHDK</p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.shdk}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nama Ayah
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.nama_ayah || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nama Ibu
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.nama_ibu || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Pendidikan & Pekerjaan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Pendidikan & Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Pendidikan
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.pendidikan}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Pekerjaan
              </p>
              <p className="text-lg font-semibold text-white">
                {pendudukData.pekerjaan}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Status & Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Status Dasar
              </p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  pendudukData.status_dasar === "HIDUP"
                    ? "bg-green-500/20 text-green-300"
                    : pendudukData.status_dasar === "MATI"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {pendudukData.status_dasar}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Dibuat
              </p>
              <p className="text-lg font-semibold text-white">
                {format(
                  new Date(pendudukData.created_at),
                  "dd MMMM yyyy HH:mm",
                  {
                    locale: id,
                  }
                )}
              </p>
            </div>
            {pendudukData.updated_at && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Terakhir Diupdate
                </p>
                <p className="text-lg font-semibold text-white">
                  {format(
                    new Date(pendudukData.updated_at),
                    "dd MMMM yyyy HH:mm",
                    {
                      locale: id,
                    }
                  )}
                </p>
              </div>
            )}
            {pendudukData.catatan && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Catatan
                </p>
                <p className="text-base text-white">{pendudukData.catatan}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
