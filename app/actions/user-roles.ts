/**
 * Server Actions untuk User Roles Management
 * Hanya bisa diakses oleh ADMIN
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/rbac";

/**
 * Assign role to user
 */
export async function assignRole(userId: string, role: string) {
  const supabase = await createClient();

  // Check if current user is admin
  if (!(await isAdmin())) {
    return { error: "Unauthorized: Only admin can assign roles" };
  }

  const { data, error } = await supabase
    .from("user_roles")
    .upsert(
      {
        user_id: userId,
        role: role,
      },
      {
        onConflict: "user_id,role",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error assigning role:", error);
    return { error: error.message };
  }

  return { data, error: null };
}

/**
 * Remove role from user
 */
export async function removeRole(userId: string, role: string) {
  const supabase = await createClient();

  // Check if current user is admin
  if (!(await isAdmin())) {
    return { error: "Unauthorized: Only admin can remove roles" };
  }

  const { data, error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role)
    .select()
    .single();

  if (error) {
    console.error("Error removing role:", error);
    return { error: error.message };
  }

  return { data, error: null };
}

/**
 * Get all users with their roles
 */
export async function getAllUsersWithRoles() {
  const supabase = await createClient();

  // Check if current user is admin
  if (!(await isAdmin())) {
    return { error: "Unauthorized: Only admin can view all users" };
  }

  // Get all users from auth.users (via Supabase Admin API or custom function)
  // Note: This requires admin privileges or a custom function
  const { data: roles, error } = await supabase.from("user_roles").select(`
      *,
      user:user_id (
        id,
        email
      )
    `);

  if (error) {
    console.error("Error fetching users with roles:", error);
    return { error: error.message };
  }

  return { data: roles, error: null };
}

/**
 * Get user role
 */
export async function getUserRole(userId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const targetUserId = userId || user?.id;

  if (!targetUserId) {
    return { error: "User not found" };
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", targetUserId)
    .single();

  if (error) {
    // User might not have role assigned yet
    return { data: null, error: null };
  }

  return { data: data?.role || null, error: null };
}
