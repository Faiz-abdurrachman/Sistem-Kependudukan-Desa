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
            result.errors.length > 0 ? ` (${result.errors.length} error)` : ""
          }`
        );
      }

      if (result.errors.length > 0) {
        console.error("Import errors:", result.errors);
        toast.error(`Ada ${result.errors.length} data yang gagal diimport`);
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
