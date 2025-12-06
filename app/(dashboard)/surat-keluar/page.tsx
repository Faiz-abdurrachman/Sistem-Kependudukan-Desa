/**
 * Surat Keluar Page - List Surat Keluar
 * Halaman untuk melihat daftar surat keluar
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSuratKeluarList } from "@/app/actions/surat-keluar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ExportButton } from "@/components/export-button";

interface SearchParams {
  page?: string | string[];
  search?: string | string[];
  jenis_surat?: string | string[];
}

export default async function SuratKeluarPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Handle searchParams
  const params =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const searchParam = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const jenisSuratParam = Array.isArray(params.jenis_surat)
    ? params.jenis_surat[0]
    : params.jenis_surat;

  const page = parseInt(pageParam || "1", 10) || 1;
  const search = searchParam || "";
  const jenisSurat = jenisSuratParam || "";

  // Convert "ALL" to undefined for filter
  const jenisSuratFilter =
    jenisSurat && jenisSurat !== "ALL" ? jenisSurat : undefined;

  const result = await getSuratKeluarList({
    page,
    limit: 10,
    search,
    jenis_surat: jenisSuratFilter,
  });

  const suratList = result.data || [];
  const count = result.count || 0;
  const totalPages = Math.max(1, result.totalPages ?? 1);
  const fetchError = result.error;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Surat Keluar
          </h1>
          <p className="text-slate-200 font-medium">
            Arsip persuratan yang dikeluarkan untuk penduduk
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            data={suratList.map((s: any) => ({
              "Nomor Surat": s.nomor_surat,
              "Jenis Surat": s.jenis_surat,
              "Tanggal Cetak": format(new Date(s.tanggal_cetak), "dd/MM/yyyy", {
                locale: id,
              }),
              "NIK Penduduk": (s.penduduk as any)?.nik || "-",
              "Nama Penduduk": (s.penduduk as any)?.nama_lengkap || "-",
            }))}
            filename="data-surat-keluar"
            sheetName="Surat Keluar"
          />
          <Link href="/surat-keluar/create">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Surat
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Cari & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-4">
            <div className="flex-1">
              <Input
                name="search"
                placeholder="Cari nomor surat..."
                defaultValue={search}
                className="bg-gray-50"
              />
            </div>
            <Select name="jenis_surat" defaultValue={jenisSurat || "ALL"}>
              <SelectTrigger className="w-[200px] bg-gray-50">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                <SelectItem value="SKTM">SKTM</SelectItem>
                <SelectItem value="DOMISILI">DOMISILI</SelectItem>
                <SelectItem value="KEMATIAN">KEMATIAN</SelectItem>
                <SelectItem value="KELAHIRAN">KELAHIRAN</SelectItem>
                <SelectItem value="USAHA">USAHA</SelectItem>
                <SelectItem value="LAINNYA">LAINNYA</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">
            Daftar Surat Keluar ({count} data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suratList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                Belum ada data surat keluar
              </p>
              <Link href="/surat-keluar/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Surat Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Nomor Surat</TableHead>
                      <TableHead className="text-white">Jenis</TableHead>
                      <TableHead className="text-white">Penduduk</TableHead>
                      <TableHead className="text-white">
                        Tanggal Cetak
                      </TableHead>
                      <TableHead className="text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suratList.map((surat: any) => {
                      const penduduk = surat.penduduk as any;
                      return (
                        <TableRow key={surat.id}>
                          <TableCell className="font-medium text-white">
                            {surat.nomor_surat}
                          </TableCell>
                          <TableCell className="text-white">
                            {surat.jenis_surat}
                          </TableCell>
                          <TableCell className="text-white">
                            {penduduk
                              ? `${penduduk.nik} - ${penduduk.nama_lengkap}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {format(
                              new Date(surat.tanggal_cetak),
                              "dd MMM yyyy",
                              { locale: id }
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/surat-keluar/${surat.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/surat-keluar/${surat.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-400">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link
                        href={`/surat-keluar?page=${
                          page - 1
                        }&search=${encodeURIComponent(
                          search
                        )}&jenis_surat=${encodeURIComponent(
                          jenisSurat || "ALL"
                        )}`}
                      >
                        <Button variant="outline" size="sm">
                          Sebelumnya
                        </Button>
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/surat-keluar?page=${
                          page + 1
                        }&search=${encodeURIComponent(
                          search
                        )}&jenis_surat=${encodeURIComponent(
                          jenisSurat || "ALL"
                        )}`}
                      >
                        <Button variant="outline" size="sm">
                          Selanjutnya
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
