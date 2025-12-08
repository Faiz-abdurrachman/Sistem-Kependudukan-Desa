/**
 * Import Button Component
 * Button untuk import data dari Excel/CSV
 */

"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { parseFile } from "@/lib/utils/import";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface ImportButtonProps {
  onImport: (data: any[]) => Promise<{ success: number; errors: string[] }>;
  acceptedFormats?: string;
  disabled?: boolean;
  label?: string;
}

export function ImportButton({
  onImport,
  acceptedFormats = ".xlsx,.xls,.csv",
  disabled = false,
  label = "Import Data",
}: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      // Parse file
      const data = await parseFile(file);

      if (data.length === 0) {
        toast.error("File kosong atau tidak ada data");
        setIsImporting(false);
        return;
      }

      // Import data
      const result = await onImport(data);

      if (result.success > 0) {
        toast.success(
          `Berhasil mengimport ${result.success} data${
            result.errors.length > 0
              ? ` (${result.errors.length} data gagal)`
              : ""
          }`
        );
      } else if (result.errors.length > 0) {
        // Jika tidak ada yang berhasil, hanya tampilkan error
        toast.error(
          `Gagal mengimport: ${result.errors.length} data error. Cek console untuk detail.`
        );
      } else {
        toast.error("Tidak ada data yang berhasil diimport");
      }

      if (result.errors.length > 0) {
        // Log errors dengan format yang lebih baik
        console.group("📋 Import Errors");
        console.log(`Total errors: ${result.errors.length}`);
        
        // Group errors by type untuk analisis yang lebih baik
        const errorGroups: { [key: string]: number } = {};
        result.errors.forEach((err) => {
          const errorType = err.split(":")[1]?.trim() || "Unknown";
          errorGroups[errorType] = (errorGroups[errorType] || 0) + 1;
        });
        
        console.log("Error summary:", errorGroups);
        
        // Log first 20 errors untuk debugging (bukan hanya 10)
        const errorPreview = result.errors.slice(0, 20);
        console.log("First 20 errors:", errorPreview);
        
        // Jika ada lebih dari 20 errors, tampilkan info
        if (result.errors.length > 20) {
          console.log(`... and ${result.errors.length - 20} more errors`);
        }
        console.groupEnd();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengimport data");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Loading Overlay saat import */}
      {isImporting && (
        <LoadingOverlay message="Mengimport data, harap tunggu..." />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isImporting}
      />
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        disabled={disabled || isImporting}
        className="gap-2 border-blue-400 bg-blue-600/20 text-blue-100 hover:bg-blue-600/40 hover:border-blue-300 hover:text-white font-semibold"
      >
        {isImporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengimport...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}
