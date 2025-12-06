/**
 * Detail Surat Keluar Page
 * Halaman untuk melihat detail lengkap data surat keluar
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSuratKeluarById } from "@/app/actions/surat-keluar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DetailSuratKeluarPage({
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

  // Get surat keluar data
  const { data: surat, error } = await getSuratKeluarById(params.id);

  if (error || !surat) {
    redirect("/surat-keluar");
  }

  const suratData = surat as any;
  const penduduk = suratData.penduduk as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/surat-keluar">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Surat Keluar
            </h1>
            <p className="text-slate-200 font-medium">
              Informasi lengkap data surat keluar
            </p>
          </div>
        </div>
        <Link href={`/surat-keluar/${params.id}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Data Surat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Data Surat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Nomor Surat
              </p>
              <p className="text-lg font-semibold text-white">
                {suratData.nomor_surat}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Jenis Surat
              </p>
              <p className="text-lg font-semibold text-white">
                {suratData.jenis_surat}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Cetak
              </p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(suratData.tanggal_cetak), "dd MMMM yyyy", {
                  locale: id,
                })}
              </p>
            </div>
            {suratData.file_pdf_url && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  File PDF
                </p>
                <a
                  href={suratData.file_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Buka File PDF
                </a>
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
                User ID: {suratData.admin_id?.substring(0, 8) || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Tanggal Dibuat
              </p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(suratData.created_at), "dd MMMM yyyy HH:mm", {
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
