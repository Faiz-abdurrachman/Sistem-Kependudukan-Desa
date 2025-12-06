/**
 * Role Guard Component
 * Hanya render children jika user punya permission tertentu
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, hasPermission } from "@/lib/utils/rbac";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "OPERATOR" | "USER";
  requiredPermission?: {
    resource: string;
    action: "read" | "create" | "update" | "delete";
  };
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        if (requiredRole) {
          const userRole = await getUserRole();
          const roles = ["USER", "OPERATOR", "ADMIN"];
          const userRoleIndex = roles.indexOf(userRole || "");
          const requiredRoleIndex = roles.indexOf(requiredRole);

          if (userRoleIndex >= requiredRoleIndex) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
            if (redirectTo) {
              router.push(redirectTo);
            }
          }
        } else if (requiredPermission) {
          const hasPerm = await hasPermission(
            requiredPermission.resource,
            requiredPermission.action
          );
          setHasAccess(hasPerm);
          if (!hasPerm && redirectTo) {
            router.push(redirectTo);
          }
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setHasAccess(false);
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [requiredRole, requiredPermission, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <p className="text-red-400">
            Anda tidak memiliki akses untuk halaman ini
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
