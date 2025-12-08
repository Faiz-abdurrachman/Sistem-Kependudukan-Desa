/**
 * Loading Overlay Component
 * Overlay loading yang ringan dan smooth, tidak membuat aplikasi lag
 */

"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  message = "Memproses...",
  fullScreen = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-[9999]" : "absolute inset-0 z-[100]"
      } flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      <div className="bg-slate-800/95 backdrop-blur-md rounded-lg shadow-2xl p-6 flex flex-col items-center space-y-4 min-w-[200px] border border-slate-700">
        {/* Spinner dengan animasi smooth */}
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-white font-medium text-sm text-center">{message}</p>
      </div>
    </div>
  );
}

/**
 * Loading Spinner Ringan
 * Untuk inline loading di button atau form
 */
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Loader2
      className={`${sizeClasses[size]} animate-spin text-current`}
      style={{
        willChange: "transform",
      }}
    />
  );
}

/**
 * Loading Skeleton untuk content
 * Ringan dan smooth
 */
export function LoadingSkeleton({
  className = "",
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
}
