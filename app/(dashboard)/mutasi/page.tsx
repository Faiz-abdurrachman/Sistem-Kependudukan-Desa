/**
 * Mutasi Page - List Mutasi Log
 * Halaman untuk melihat daftar mutasi penduduk
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getMutasiList } from "@/app/actions/mutasi";
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
  jenis_mutasi?: string | string[];
}

export default async function MutasiPage({
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
  const jenisMutasiParam = Array.isArray(params.jenis_mutasi)
    ? params.jenis_mutasi[0]
    : params.jenis_mutasi;

  const page = parseInt(pageParam || "1", 10) || 1;
  const search = searchParam || "";
  const jenisMutasi = jenisMutasiParam || "";

  // Convert "ALL" to undefined for filter
  const jenisMutasiFilter =
    jenisMutasi && jenisMutasi !== "ALL" ? jenisMutasi : undefined;

  const result = await getMutasiList({
    page,
    limit: 10,
    search,
    jenis_mutasi: jenisMutasiFilter,
  });

  const mutasiList = result.data || [];
  const count = result.count || 0;
  const totalPages = Math.max(1, result.totalPages ?? 1);
  const fetchError = result.error;

  // Helper untuk badge warna berdasarkan jenis mutasi
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Mutasi Penduduk
          </h1>
          <p className="text-slate-200 font-medium">
            Catatan perubahan status penduduk (Lahir, Mati, Pindah)
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            data={mutasiList.map((m: any) => ({
              Tanggal: format(new Date(m.tanggal_peristiwa), "dd/MM/yyyy", {
                locale: id,
              }),
              "Jenis Mutasi": m.jenis_mutasi.replace("_", " "),
              "NIK Penduduk": (m.penduduk as any)?.nik || "-",
              "Nama Penduduk": (m.penduduk as any)?.nama_lengkap || "-",
              Keterangan: m.keterangan || "-",
            }))}
            filename="data-mutasi"
            sheetName="Mutasi"
          />
          <Link href="/mutasi/create">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Mutasi
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
                placeholder="Cari keterangan..."
                defaultValue={search}
                className="bg-gray-50"
              />
            </div>
            <Select name="jenis_mutasi" defaultValue={jenisMutasi || "ALL"}>
              <SelectTrigger className="w-[200px] bg-gray-50">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                <SelectItem value="LAHIR">LAHIR</SelectItem>
                <SelectItem value="MATI">MATI</SelectItem>
                <SelectItem value="PINDAH_DATANG">PINDAH DATANG</SelectItem>
                <SelectItem value="PINDAH_KELUAR">PINDAH KELUAR</SelectItem>
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
            Daftar Mutasi ({count} data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mutasiList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Belum ada data mutasi</p>
              <Link href="/mutasi/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Mutasi Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Tanggal</TableHead>
                      <TableHead className="text-white">Jenis</TableHead>
                      <TableHead className="text-white">Penduduk</TableHead>
                      <TableHead className="text-white">Keterangan</TableHead>
                      <TableHead className="text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mutasiList.map((mutasi: any) => {
                      const penduduk = mutasi.penduduk as any;
                      return (
                        <TableRow key={mutasi.id}>
                          <TableCell className="text-white">
                            {format(
                              new Date(mutasi.tanggal_peristiwa),
                              "dd MMM yyyy",
                              { locale: id }
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getJenisMutasiBadge(
                                mutasi.jenis_mutasi
                              )}`}
                            >
                              {mutasi.jenis_mutasi.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-white">
                            {penduduk
                              ? `${penduduk.nik} - ${penduduk.nama_lengkap}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {mutasi.keterangan || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/mutasi/${mutasi.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/mutasi/${mutasi.id}/edit`}>
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
                        href={`/mutasi?page=${
                          page - 1
                        }&search=${encodeURIComponent(
                          search
                        )}&jenis_mutasi=${encodeURIComponent(
                          jenisMutasi || "ALL"
                        )}`}
                      >
                        <Button variant="outline" size="sm">
                          Sebelumnya
                        </Button>
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/mutasi?page=${
                          page + 1
                        }&search=${encodeURIComponent(
                          search
                        )}&jenis_mutasi=${encodeURIComponent(
                          jenisMutasi || "ALL"
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
