/**
 * Kartu Keluarga Page - List Kartu Keluarga
 * Halaman untuk melihat daftar kartu keluarga
 */

import { getKartuKeluargaList } from "@/app/actions/kartu-keluarga";
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
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";
import { importKartuKeluarga } from "@/app/actions/kartu-keluarga";

interface SearchParams {
  page?: string | string[];
  search?: string | string[];
}

export default async function KartuKeluargaPage({
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

  const result = await getKartuKeluargaList({
    page,
    limit: 10,
    search,
  });

  const kkList = result.data || [];
  const count = result.count || 0;
  const totalPages = Math.max(1, result.totalPages ?? 1);
  const fetchError = result.error;

  if (fetchError) {
    console.error("Error fetching kartu keluarga list:", {
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Kartu Keluarga
          </h1>
          <p className="text-slate-200 font-medium">
            Kelola data kartu keluarga desa
          </p>
        </div>
        <div className="flex gap-3">
          <ImportButton
            onImport={importKartuKeluarga}
            label="Import Kartu Keluarga"
          />
          <ExportButton
            data={kkList.map((kk: any) => ({
              "Nomor KK": kk.nomor_kk,
              "Kepala Keluarga": kk.kepala_keluarga
                ? `${(kk.kepala_keluarga as any).nik} - ${
                    (kk.kepala_keluarga as any).nama_lengkap
                  }`
                : "-",
              Alamat: kk.alamat_lengkap,
              Wilayah: kk.wilayah
                ? `${(kk.wilayah as any).dusun}${
                    (kk.wilayah as any).rw
                      ? `, RW ${(kk.wilayah as any).rw}`
                      : ""
                  }${
                    (kk.wilayah as any).rt
                      ? `, RT ${(kk.wilayah as any).rt}`
                      : ""
                  }`
                : "-",
            }))}
            filename="data-kartu-keluarga"
            sheetName="Kartu Keluarga"
          />
          <Link href="/kartu-keluarga/create">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kartu Keluarga
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
                placeholder="Cari Nomor KK atau Alamat..."
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
            Daftar Kartu Keluarga ({count} data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kkList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                Belum ada data kartu keluarga
              </p>
              <Link href="/kartu-keluarga/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kartu Keluarga Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-700 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Nomor KK</TableHead>
                      <TableHead className="text-white hidden sm:table-cell">
                        Kepala Keluarga
                      </TableHead>
                      <TableHead className="text-white hidden md:table-cell">
                        Alamat
                      </TableHead>
                      <TableHead className="text-white hidden lg:table-cell">
                        Wilayah
                      </TableHead>
                      <TableHead className="text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kkList.map((kk: any) => {
                      const wilayah = kk.wilayah as any;
                      const kepalaKeluarga = kk.kepala_keluarga as any;
                      const wilayahLabel = wilayah
                        ? `${wilayah.dusun}${
                            wilayah.rw ? `, RW ${wilayah.rw}` : ""
                          }${wilayah.rt ? `, RT ${wilayah.rt}` : ""}`
                        : "-";

                      return (
                        <TableRow key={kk.id}>
                          <TableCell className="font-medium text-white">
                            {kk.nomor_kk}
                          </TableCell>
                          <TableCell className="text-white hidden sm:table-cell">
                            {kepalaKeluarga
                              ? `${kepalaKeluarga.nik} - ${kepalaKeluarga.nama_lengkap}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-slate-300 hidden md:table-cell">
                            {kk.alamat_lengkap}
                          </TableCell>
                          <TableCell className="text-slate-300 hidden lg:table-cell">
                            {wilayahLabel}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/kartu-keluarga/${kk.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/kartu-keluarga/${kk.id}/edit`}>
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
                        href={`/kartu-keluarga?page=${
                          page - 1
                        }&search=${search}`}
                      >
                        <Button variant="outline" size="sm">
                          Sebelumnya
                        </Button>
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/kartu-keluarga?page=${
                          page + 1
                        }&search=${search}`}
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
