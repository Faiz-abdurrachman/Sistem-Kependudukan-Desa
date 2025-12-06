/**
 * Detail Wilayah Page
 * Halaman untuk melihat detail lengkap data wilayah
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWilayahById } from "@/app/actions/wilayah";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DetailWilayahPage({
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

  // Get wilayah data
  const { data: wilayah, error } = await getWilayahById(params.id);

  if (error || !wilayah) {
    redirect("/wilayah");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/wilayah">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Wilayah
            </h1>
            <p className="text-slate-200 font-medium">
              Informasi lengkap data wilayah
            </p>
          </div>
        </div>
        <Link href={`/wilayah/${params.id}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Data Wilayah */}
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
                <p className="text-lg font-semibold text-white">{wilayah.rw}</p>
              </div>
            )}
            {wilayah.rt && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">RT</p>
                <p className="text-lg font-semibold text-white">{wilayah.rt}</p>
              </div>
            )}
            {wilayah.nama_desa && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Desa</p>
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
                {format(new Date(wilayah.created_at), "dd MMMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
            {wilayah.updated_at && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Terakhir Diupdate
                </p>
                <p className="text-lg font-semibold text-white">
                  {format(new Date(wilayah.updated_at), "dd MMMM yyyy HH:mm", {
                    locale: id,
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
