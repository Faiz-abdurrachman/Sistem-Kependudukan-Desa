/**
 * Detail Kartu Keluarga Page
 * Halaman untuk melihat detail lengkap data kartu keluarga
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getKartuKeluargaById } from "@/app/actions/kartu-keluarga";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DetailKKPage({
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

  // Get kartu keluarga data
  const { data: kk, error } = await getKartuKeluargaById(params.id);

  if (error || !kk) {
    redirect("/kartu-keluarga");
  }

  const kkData = kk as any;
  const wilayah = kkData.wilayah as any;
  const kepalaKeluarga = kkData.kepala_keluarga as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/kartu-keluarga">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Kartu Keluarga
            </h1>
            <p className="text-slate-200 font-medium">
              Informasi lengkap data kartu keluarga
            </p>
          </div>
        </div>
        <Link href={`/kartu-keluarga/${params.id}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Data Kartu Keluarga */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Data Kartu Keluarga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nomor KK
              </p>
              <p className="text-lg font-semibold text-white">
                {kkData.nomor_kk}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Alamat Lengkap
              </p>
              <p className="text-lg font-semibold text-white">
                {kkData.alamat_lengkap}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Wilayah */}
      {wilayah && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Data Wilayah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Dusun</p>
                <p className="text-lg font-semibold text-white">
                  {wilayah.dusun}
                </p>
              </div>
              {wilayah.rw && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">RW</p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.rw}
                  </p>
                </div>
              )}
              {wilayah.rt && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">RT</p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.rt}
                  </p>
                </div>
              )}
              {wilayah.nama_desa && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Desa
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.nama_desa}
                  </p>
                </div>
              )}
              {wilayah.nama_kecamatan && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Kecamatan
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.nama_kecamatan}
                  </p>
                </div>
              )}
              {wilayah.nama_kabupaten && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Kabupaten
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.nama_kabupaten}
                  </p>
                </div>
              )}
              {wilayah.nama_provinsi && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Provinsi
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {wilayah.nama_provinsi}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Kepala Keluarga */}
      {kepalaKeluarga && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Kepala Keluarga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">NIK</p>
                <p className="text-lg font-semibold text-white">
                  {kepalaKeluarga.nik}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Nama Lengkap
                </p>
                <p className="text-lg font-semibold text-white">
                  {kepalaKeluarga.nama_lengkap}
                </p>
              </div>
              {kepalaKeluarga.tempat_lahir && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Tempat/Tgl Lahir
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {kepalaKeluarga.tempat_lahir},{" "}
                    {kepalaKeluarga.tgl_lahir
                      ? format(
                          new Date(kepalaKeluarga.tgl_lahir),
                          "dd MMMM yyyy",
                          { locale: id }
                        )
                      : ""}
                  </p>
                </div>
              )}
              {kepalaKeluarga.jenis_kelamin && (
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Jenis Kelamin
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {kepalaKeluarga.jenis_kelamin}
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
                Tanggal Dibuat
              </p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(kkData.created_at), "dd MMMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
            {kkData.updated_at && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Terakhir Diupdate
                </p>
                <p className="text-lg font-semibold text-white">
                  {format(new Date(kkData.updated_at), "dd MMMM yyyy HH:mm", {
                    locale: id,
                  })}
                </p>
              </div>
            )}
            {kkData.foto_scan_url && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Foto Scan KK
                </p>
                <a
                  href={kkData.foto_scan_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {kkData.foto_scan_url}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
