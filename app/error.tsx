"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-red-500/50 bg-slate-800/95">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Terjadi Kesalahan
          </CardTitle>
          <CardDescription className="text-slate-300 mt-2">
            Maaf, terjadi kesalahan saat memproses permintaan Anda.
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

          <div className="flex flex-col gap-2">
            <Button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Jika masalah berlanjut, silakan hubungi administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

