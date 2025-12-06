/**
 * RBAC Utilities
 * Helper functions untuk Role-Based Access Control
 */

import { createClient } from "@/lib/supabase/server";

export type UserRole = "ADMIN" | "OPERATOR" | "USER";

export interface Permission {
  resource: string;
  action: "read" | "create" | "update" | "delete";
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return data.role as UserRole;
}

/**
 * Check if user has role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Check if user has permission
 */
export async function hasPermission(
  resource: string,
  action: "read" | "create" | "update" | "delete"
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Call database function
  const { data, error } = await supabase.rpc("has_permission", {
    permission_name: `${resource}:${action}`,
  });

  if (error) {
    console.error("Error checking permission:", error);
    return false;
  }

  return data === true;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

/**
 * Check if user is operator
 */
export async function isOperator(): Promise<boolean> {
  const role = await getUserRole();
  return role === "OPERATOR" || role === "ADMIN";
}

/**
 * Check if user can create
 */
export async function canCreate(resource: string): Promise<boolean> {
  return hasPermission(resource, "create");
}

/**
 * Check if user can update
 */
export async function canUpdate(resource: string): Promise<boolean> {
  return hasPermission(resource, "update");
}

/**
 * Check if user can delete
 */
export async function canDelete(resource: string): Promise<boolean> {
  return hasPermission(resource, "delete");
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<string[]> {
  const role = await getUserRole();
  if (!role) return [];

  const permissions: Record<UserRole, string[]> = {
    ADMIN: [
      "penduduk:read",
      "penduduk:create",
      "penduduk:update",
      "penduduk:delete",
      "kk:read",
      "kk:create",
      "kk:update",
      "kk:delete",
      "wilayah:read",
      "wilayah:create",
      "wilayah:update",
      "wilayah:delete",
      "mutasi:read",
      "mutasi:create",
      "mutasi:update",
      "mutasi:delete",
      "surat:read",
      "surat:create",
      "surat:update",
      "surat:delete",
      "laporan:read",
      "pengaturan:read",
      "pengaturan:update",
    ],
    OPERATOR: [
      "penduduk:read",
      "penduduk:create",
      "penduduk:update",
      "penduduk:delete",
      "kk:read",
      "kk:create",
      "kk:update",
      "kk:delete",
      "wilayah:read",
      "wilayah:create",
      "wilayah:update",
      "wilayah:delete",
      "mutasi:read",
      "mutasi:create",
      "mutasi:update",
      "mutasi:delete",
      "surat:read",
      "surat:create",
      "surat:update",
      "surat:delete",
      "laporan:read",
    ],
    USER: [
      "penduduk:read",
      "kk:read",
      "wilayah:read",
      "mutasi:read",
      "surat:read",
      "surat:create",
    ],
  };

  return permissions[role] || [];
}
