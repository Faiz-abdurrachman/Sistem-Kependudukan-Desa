/**
 * Loading Component untuk Dashboard Pages
 * Ditampilkan saat halaman sedang loading
 * Optimized untuk performa - tidak lag
 */

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        {/* Spinner dengan optimasi performa */}
        <div className="relative inline-block">
          <Loader2
            className="h-12 w-12 animate-spin text-blue-500 mx-auto"
            style={{
              willChange: "transform",
            }}
          />
          {/* Pulse ring untuk efek visual */}
          <div
            className="absolute inset-0 rounded-full border-2 border-blue-200/50"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              willChange: "opacity",
            }}
          />
        </div>
        <p className="text-slate-300 font-medium animate-pulse">
          Memuat data...
        </p>
      </div>
    </div>
  );
}
