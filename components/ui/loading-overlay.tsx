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
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10"
      } flex items-center justify-center bg-black/20 backdrop-blur-sm`}
      style={{
        // Optimasi performa dengan will-change
        willChange: "opacity",
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 min-w-[200px]">
        {/* Spinner dengan animasi smooth */}
        <div className="relative">
          <Loader2
            className="h-10 w-10 animate-spin text-blue-600"
            style={{
              // Optimasi animasi dengan transform
              willChange: "transform",
            }}
          />
          {/* Pulse effect ringan */}
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              willChange: "opacity",
            }}
          />
        </div>
        <p className="text-gray-700 font-medium text-sm">{message}</p>
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
