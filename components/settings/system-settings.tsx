/**
 * System Settings Component
 * Pengaturan sistem
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Download, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { exportAllData, backupDatabase } from "@/app/actions/system";
import Link from "next/link";

export function SystemSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportAllData();

      if (result.error) {
        toast.error(result.error);
        setIsExporting(false);
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

      toast.success("Semua data berhasil di-export ke Excel");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengexport data");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = await backupDatabase();

      if (result.error) {
        toast.error(result.error);
        setIsBackingUp(false);
        return;
      }

      // Download file
      const link = document.createElement("a");
      const blob = new Blob(
        [Uint8Array.from(atob(result.data!), (c) => c.charCodeAt(0))],
        {
          type: "application/json",
        }
      );
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = result.filename!;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup database berhasil dibuat");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat backup");
      console.error("Backup error:", error);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informasi Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Provider</p>
              <p className="text-white font-semibold">Supabase (PostgreSQL)</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <p className="text-green-400 font-semibold">● Terhubung</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manajemen Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Export Data</h3>
                <Download className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Export semua data ke file Excel untuk backup atau migrasi
              </p>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="outline"
                className="w-full"
              >
                {isExporting ? "Mengexport..." : "Export Semua Data"}
              </Button>
            </div>

            <div className="p-4 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Backup Database</h3>
                <Download className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Buat backup lengkap database untuk keamanan data
              </p>
              <Button
                onClick={handleBackup}
                disabled={isBackingUp}
                variant="outline"
                className="w-full"
              >
                {isBackingUp ? "Membuat Backup..." : "Buat Backup"}
              </Button>
            </div>

            <div className="p-4 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Import Data</h3>
                <Upload className="h-5 w-5 text-orange-400" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Import data dari file Excel per modul (Wilayah, Penduduk, Kartu
                Keluarga)
              </p>
              <div className="space-y-2">
                <a href="/wilayah" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-orange-400 bg-orange-600/20 text-orange-100 hover:bg-orange-600/40 hover:border-orange-300"
                  >
                    Import Wilayah
                  </Button>
                </a>
                <a href="/penduduk" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-orange-400 bg-orange-600/20 text-orange-100 hover:bg-orange-600/40 hover:border-orange-300"
                  >
                    Import Penduduk
                  </Button>
                </a>
                <a href="/kartu-keluarga" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-orange-400 bg-orange-600/20 text-orange-100 hover:bg-orange-600/40 hover:border-orange-300"
                  >
                    Import Kartu Keluarga
                  </Button>
                </a>
              </div>
            </div>

            <div className="p-4 border border-red-700/50 rounded-lg bg-red-900/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Hapus Data</h3>
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Hapus semua data (tindakan ini tidak dapat dibatalkan)
              </p>
              <Button
                variant="outline"
                disabled
                className="w-full border-red-700 text-red-400"
              >
                Hapus Semua Data (Disabled)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Informasi Sistem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Versi Aplikasi</p>
              <p className="text-white font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Framework</p>
              <p className="text-white font-semibold">Next.js 16</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Database</p>
              <p className="text-white font-semibold">PostgreSQL (Supabase)</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <p className="text-green-400 font-semibold">Production Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
