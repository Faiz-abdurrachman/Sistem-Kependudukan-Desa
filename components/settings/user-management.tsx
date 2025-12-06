/**
 * User Management Component
 * Hanya bisa diakses oleh ADMIN
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  assignRole,
  removeRole,
  getAllUsersWithRoles,
} from "@/app/actions/user-roles";

interface UserWithRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
  };
}

export function UserManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsersWithRoles();
      if (result.error) {
        toast.error(result.error);
      } else {
        setUsers(result.data || []);
      }
    } catch (error: any) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, role: string) => {
    try {
      const result = await assignRole(userId, role);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Role ${role} berhasil di-assign`);
        setEditingRole(null);
        loadUsers();
      }
    } catch (error: any) {
      toast.error("Gagal assign role");
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    if (!confirm(`Yakin ingin menghapus role ${role} dari user ini?`)) {
      return;
    }

    try {
      const result = await removeRole(userId, role);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role berhasil dihapus");
        loadUsers();
      }
    } catch (error: any) {
      toast.error("Gagal menghapus role");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-400">Memuat data user...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manajemen User
          </CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400">
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
          </Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Belum ada user terdaftar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Tanggal Dibuat</TableHead>
                  <TableHead className="text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell className="text-white">
                      {userRole.user?.email || userRole.user_id}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          userRole.role === "ADMIN"
                            ? "bg-red-500/20 text-red-300"
                            : userRole.role === "OPERATOR"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {userRole.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(userRole.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingRole === userRole.id ? (
                          <>
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger className="w-32 bg-gray-50">
                                <SelectValue placeholder="Pilih role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="OPERATOR">
                                  OPERATOR
                                </SelectItem>
                                <SelectItem value="USER">USER</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAssignRole(userRole.user_id, newRole)
                              }
                              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
                            >
                              Simpan
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRole(null)}
                            >
                              Batal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRole(userRole.id);
                                setNewRole(userRole.role);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRemoveRole(
                                  userRole.user_id,
                                  userRole.role
                                )
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Cara Menambah User Baru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-slate-300">
          <p>
            1. Tambah user baru via Supabase Dashboard → Authentication → Users
          </p>
          <p>
            2. Atau gunakan fitur "Tambah User" di atas (akan segera tersedia)
          </p>
          <p>3. Assign role ke user baru dengan klik tombol Edit</p>
        </CardContent>
      </Card>
    </div>
  );
}
