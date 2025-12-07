"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md border-red-500/50 bg-slate-800/95">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Kesalahan Sistem
            </CardTitle>
            <CardDescription className="text-slate-300 mt-2">
              Terjadi kesalahan kritis pada aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && (
              <div className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                <p className="text-xs text-red-400 font-mono break-all">
                  {error.message || "Unknown error"}
                </p>
              </div>
            )}

            <Button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang Halaman
            </Button>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Silakan refresh halaman atau hubungi administrator jika masalah
                berlanjut.
              </p>
            </div>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
