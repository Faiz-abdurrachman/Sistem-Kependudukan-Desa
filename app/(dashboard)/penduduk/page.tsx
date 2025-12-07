/**
 * Penduduk Page - List Penduduk
 * Halaman untuk melihat daftar penduduk
 */

import { getPendudukList, importPenduduk } from "@/app/actions/penduduk";
import { canCreate, canUpdate, canDelete } from "@/lib/utils/rbac";
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
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";

interface SearchParams {
  page?: string | string[];
  search?: string | string[];
  status_dasar?: "HIDUP" | "MATI" | "PINDAH" | string | string[];
}

export default async function PendudukPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  // Auth sudah di-check di layout, tidak perlu lagi di sini

  // Handle searchParams (bisa Promise di Next.js 15+)
  const params =
    searchParams instanceof Promise ? await searchParams : searchParams;

  // Extract values (handle array jika ada)
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const searchParam = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const statusParam = Array.isArray(params.status_dasar)
    ? params.status_dasar[0]
    : params.status_dasar;

  const page = parseInt(pageParam || "1", 10) || 1;
  const search = searchParam || "";
  const status_dasar = (statusParam as "HIDUP" | "MATI" | "PINDAH") || "HIDUP";

  const result = await getPendudukList({
    page,
    limit: 10,
    search,
    status_dasar,
  });

  const pendudukList = result.data || [];
  const count = result.count || 0;
  // Ensure totalPages is always a number
  const totalPages = Math.max(1, result.totalPages ?? 1);
  const fetchError = result.error;

  // Check permissions in parallel
  const [canCreatePenduduk, canUpdatePenduduk, canDeletePenduduk] =
    await Promise.all([
      canCreate("penduduk"),
      canUpdate("penduduk"),
      canDelete("penduduk"),
    ]);

  // Jika ada error, tampilkan di console untuk debugging
  if (fetchError) {
    console.error("Error fetching penduduk list:", {
      error: fetchError,
      errorType: typeof fetchError,
      errorString: String(fetchError),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Penduduk</h1>
          <p className="text-slate-200 font-medium">
            Kelola data penduduk desa
          </p>
        </div>
        <div className="flex gap-3">
          <ImportButton onImport={importPenduduk} label="Import Penduduk" />
          <ExportButton
            data={pendudukList.map((p: any) => ({
              NIK: p.nik,
              "Nama Lengkap": p.nama_lengkap,
              "Tempat Lahir": p.tempat_lahir,
              "Tanggal Lahir": p.tgl_lahir,
              "Jenis Kelamin": p.jenis_kelamin,
              Agama: p.agama,
              "Status Kawin": p.status_kawin,
              Pendidikan: p.pendidikan,
              Pekerjaan: p.pekerjaan,
              "Status Dasar": p.status_dasar,
            }))}
            filename="data-penduduk"
            sheetName="Penduduk"
          />
          {canCreatePenduduk && (
            <Link href="/penduduk/create">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Penduduk
              </Button>
            </Link>
          )}
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
                placeholder="Cari NIK atau Nama..."
                defaultValue={search}
                className="bg-gray-50"
              />
            </div>
            <select
              name="status_dasar"
              defaultValue={status_dasar}
              className="h-11 rounded-md border-2 border-gray-500 bg-gray-50 px-4 text-sm font-semibold text-gray-900"
            >
              <option value="HIDUP">Hidup</option>
              <option value="MATI">Mati</option>
              <option value="PINDAH">Pindah</option>
            </select>
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
            Daftar Penduduk ({count} data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendudukList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Belum ada data penduduk</p>
              <Link href="/penduduk/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Penduduk Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">NIK</TableHead>
                      <TableHead className="text-white">Nama Lengkap</TableHead>
                      <TableHead className="text-white">
                        Tempat/Tgl Lahir
                      </TableHead>
                      <TableHead className="text-white">
                        Jenis Kelamin
                      </TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendudukList.map((penduduk: any) => (
                      <TableRow key={penduduk.id}>
                        <TableCell className="font-medium text-white">
                          {penduduk.nik}
                        </TableCell>
                        <TableCell className="text-white">
                          {penduduk.nama_lengkap}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {penduduk.tempat_lahir},{" "}
                          {format(new Date(penduduk.tgl_lahir), "dd MMM yyyy", {
                            locale: id,
                          })}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {penduduk.jenis_kelamin}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              penduduk.status_dasar === "HIDUP"
                                ? "bg-green-500/20 text-green-300"
                                : penduduk.status_dasar === "MATI"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {penduduk.status_dasar}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/penduduk/${penduduk.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {canUpdatePenduduk && (
                              <Link href={`/penduduk/${penduduk.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages! > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-400">
                    Halaman {page} dari {totalPages!}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link
                        href={`/penduduk?page=${
                          page - 1
                        }&search=${search}&status_dasar=${status_dasar}`}
                      >
                        <Button variant="outline" size="sm">
                          Sebelumnya
                        </Button>
                      </Link>
                    )}
                    {page < totalPages! && (
                      <Link
                        href={`/penduduk?page=${
                          page + 1
                        }&search=${search}&status_dasar=${status_dasar}`}
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
