/**
 * Report Generator Component
 * Component untuk generate berbagai jenis laporan
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  generateReportPenduduk,
  generateReportMutasi,
  generateReportSurat,
  generateReportStatistik,
} from "@/app/actions/reports";

export function ReportGenerator() {
  // Separate state for each report category
  const [pendudukType, setPendudukType] = useState<string>("");
  const [mutasiType, setMutasiType] = useState<string>("");
  const [suratType, setSuratType] = useState<string>("");
  const [statistikType, setStatistikType] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (
    category: "penduduk" | "mutasi" | "surat" | "statistik"
  ) => {
    let reportType = "";
    if (category === "penduduk") {
      reportType = pendudukType;
    } else if (category === "mutasi") {
      reportType = mutasiType;
    } else if (category === "surat") {
      reportType = suratType;
    } else if (category === "statistik") {
      reportType = statistikType;
    }

    if (!reportType) {
      toast.error("Pilih jenis laporan terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    toast.info("Sedang generate laporan...");

    try {
      let result;

      // Determine category from reportType
      if (reportType.startsWith("penduduk-")) {
        result = await generateReportPenduduk(reportType);
      } else if (reportType.startsWith("mutasi-")) {
        result = await generateReportMutasi(reportType);
      } else if (reportType.startsWith("surat-")) {
        result = await generateReportSurat(reportType);
      } else if (reportType.startsWith("statistik-")) {
        result = await generateReportStatistik(reportType);
      } else {
        toast.error("Jenis laporan tidak valid");
        setIsGenerating(false);
        return;
      }

      if (result.error) {
        toast.error(result.error);
        setIsGenerating(false);
        return;
      }

      if (!result.data) {
        toast.error("Tidak ada data untuk di-generate");
        setIsGenerating(false);
        return;
      }

      // Download file
      const link = document.createElement("a");
      const blob = new Blob(
        [Uint8Array.from(atob(result.data!), (c) => c.charCodeAt(0))],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = result.filename!;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Laporan ${result.jenis} berhasil di-generate (${result.count} data)`
      );
    } catch (error: any) {
      toast.error(error.message || "Gagal generate laporan");
      console.error("Generate report error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Laporan Penduduk */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Laporan Penduduk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Jenis Laporan</Label>
            <Select
              value={pendudukType}
              onValueChange={(value) => {
                setPendudukType(value);
              }}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penduduk-all">Semua Penduduk</SelectItem>
                <SelectItem value="penduduk-hidup">Penduduk Hidup</SelectItem>
                <SelectItem value="penduduk-mati">
                  Penduduk Meninggal
                </SelectItem>
                <SelectItem value="penduduk-pindah">Penduduk Pindah</SelectItem>
                <SelectItem value="penduduk-per-wilayah">
                  Penduduk per Wilayah
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleGenerate("penduduk")}
            disabled={isGenerating || !pendudukType}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate & Download"}
          </Button>
        </CardContent>
      </Card>

      {/* Laporan Mutasi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Laporan Mutasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Jenis Laporan</Label>
            <Select
              value={mutasiType}
              onValueChange={(value) => {
                setMutasiType(value);
              }}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mutasi-bulanan">Mutasi Bulanan</SelectItem>
                <SelectItem value="mutasi-tahunan">Mutasi Tahunan</SelectItem>
                <SelectItem value="mutasi-lahir">Laporan Kelahiran</SelectItem>
                <SelectItem value="mutasi-mati">Laporan Kematian</SelectItem>
                <SelectItem value="mutasi-pindah">Laporan Pindah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleGenerate("mutasi")}
            disabled={isGenerating || !mutasiType}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate & Download"}
          </Button>
        </CardContent>
      </Card>

      {/* Laporan Surat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Laporan Surat Keluar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Jenis Laporan</Label>
            <Select
              value={suratType}
              onValueChange={(value) => {
                setSuratType(value);
              }}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surat-bulanan">Surat Bulanan</SelectItem>
                <SelectItem value="surat-tahunan">Surat Tahunan</SelectItem>
                <SelectItem value="surat-per-jenis">Surat per Jenis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleGenerate("surat")}
            disabled={isGenerating || !suratType}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate & Download"}
          </Button>
        </CardContent>
      </Card>

      {/* Laporan Statistik */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Laporan Statistik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Jenis Laporan</Label>
            <Select
              value={statistikType}
              onValueChange={(value) => {
                setStatistikType(value);
              }}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="statistik-penduduk">
                  Statistik Penduduk
                </SelectItem>
                <SelectItem value="statistik-demografi">
                  Statistik Demografi
                </SelectItem>
                <SelectItem value="statistik-mutasi">
                  Statistik Mutasi
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleGenerate("statistik")}
            disabled={isGenerating || !statistikType}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate & Download"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
