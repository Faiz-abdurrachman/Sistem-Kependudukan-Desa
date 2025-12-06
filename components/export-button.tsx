/**
 * Export Button Component
 * Button untuk export data ke Excel/CSV
 */

"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel, exportToCSV } from "@/lib/utils/export";
import { toast } from "sonner";

interface ExportButtonProps<T extends Record<string, any>> {
  data: T[];
  filename: string;
  sheetName?: string;
  format?: "excel" | "csv" | "both";
  disabled?: boolean;
}

export function ExportButton<T extends Record<string, any>>({
  data,
  filename,
  sheetName = "Data",
  format = "excel",
  disabled = false,
}: ExportButtonProps<T>) {
  const handleExport = () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    try {
      if (format === "excel" || format === "both") {
        exportToExcel(data, filename, sheetName);
        toast.success(`Data berhasil di-export ke Excel`);
      }

      if (format === "csv" || format === "both") {
        exportToCSV(data, filename);
        toast.success(`Data berhasil di-export ke CSV`);
      }
    } catch (error) {
      toast.error("Gagal mengexport data");
      console.error("Export error:", error);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      disabled={disabled || data.length === 0}
      className="gap-2 border-green-400 bg-green-600/20 text-green-100 hover:bg-green-600/40 hover:border-green-300 hover:text-white font-semibold"
    >
      <Download className="h-4 w-4" />
      Export {format === "both" ? "Data" : format.toUpperCase()}
    </Button>
  );
}
