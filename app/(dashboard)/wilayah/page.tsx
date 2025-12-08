/**
 * Wilayah Page - List Wilayah
 * Halaman untuk melihat daftar wilayah
 */

import { getWilayahList } from "@/app/actions/wilayah";
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
import { Input } from "@/components/ui/input";
import { deleteWilayah, importWilayah } from "@/app/actions/wilayah";
import { DeleteButton } from "@/components/wilayah/delete-button";
import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";

interface SearchParams {
  page?: string | string[];
  search?: string | string[];
}

export default async function WilayahPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  // Auth sudah di-check di layout

  // Handle searchParams
  const params =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const searchParam = Array.isArray(params.search)
    ? params.search[0]
    : params.search;

  const page = parseInt(pageParam || "1", 10) || 1;
  const search = searchParam || "";

  const result = await getWilayahList({
    page,
    limit: 10,
    search,
  });

  const wilayahList = result.data || [];
  const count = result.count || 0;
  const totalPages = Math.max(1, result.totalPages ?? 1);
  const fetchError = result.error;

  if (fetchError) {
    console.error("Error fetching wilayah list:", {
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
          <h1 className="text-3xl font-bold text-white mb-2">Data Wilayah</h1>
          <p className="text-slate-200 font-medium">
            Kelola data wilayah administratif (Dusun/RW/RT)
          </p>
        </div>
        <div className="flex gap-3">
          <ImportButton onImport={importWilayah} label="Import Wilayah" />
          <ExportButton
            data={wilayahList.map((w: any) => ({
              Dusun: w.dusun,
              RW: w.rw || "-",
              RT: w.rt || "-",
              "Nama Desa": w.nama_desa || "-",
              Kecamatan: w.nama_kecamatan || "-",
              Kabupaten: w.nama_kabupaten || "-",
              Provinsi: w.nama_provinsi || "-",
            }))}
            filename="data-wilayah"
            sheetName="Wilayah"
          />
          <Link href="/wilayah/create">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Wilayah
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Cari</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-4">
            <div className="flex-1">
              <Input
                name="search"
                placeholder="Cari Dusun, RW, RT, atau Nama Desa..."
                defaultValue={search}
                className="bg-gray-50"
              />
            </div>
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
            Daftar Wilayah ({count} data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wilayahList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Belum ada data wilayah</p>
              <Link href="/wilayah/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Wilayah Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-700 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Dusun</TableHead>
                      <TableHead className="text-white hidden sm:table-cell">
                        RW
                      </TableHead>
                      <TableHead className="text-white">RT</TableHead>
                      <TableHead className="text-white hidden md:table-cell">
                        Desa
                      </TableHead>
                      <TableHead className="text-white hidden lg:table-cell">
                        Kecamatan
                      </TableHead>
                      <TableHead className="text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wilayahList.map((wilayah: any) => (
                      <TableRow key={wilayah.id}>
                        <TableCell className="font-medium text-white">
                          {wilayah.dusun}
                        </TableCell>
                        <TableCell className="text-slate-300 hidden sm:table-cell">
                          {wilayah.rw || "-"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {wilayah.rt || "-"}
                        </TableCell>
                        <TableCell className="text-slate-300 hidden md:table-cell">
                          {wilayah.nama_desa || "-"}
                        </TableCell>
                        <TableCell className="text-slate-300 hidden lg:table-cell">
                          {wilayah.nama_kecamatan || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/wilayah/${wilayah.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/wilayah/${wilayah.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DeleteButton wilayahId={wilayah.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                      <Link href={`/wilayah?page=${page - 1}&search=${search}`}>
                        <Button variant="outline" size="sm">
                          Sebelumnya
                        </Button>
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link href={`/wilayah?page=${page + 1}&search=${search}`}>
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
