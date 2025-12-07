/**
 * Dashboard Charts Component
 * Charts untuk visualisasi data
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  mutasiCounts: {
    LAHIR: number;
    MATI: number;
    PINDAH_DATANG: number;
    PINDAH_KELUAR: number;
  };
  suratCounts: Record<string, number>;
  jkCounts: {
    "LAKI-LAKI": number;
    PEREMPUAN: number;
  };
}

const COLORS = {
  mutasi: {
    LAHIR: "#10B981",
    MATI: "#EF4444",
    PINDAH_DATANG: "#3B82F6",
    PINDAH_KELUAR: "#F59E0B",
  },
  jk: {
    "LAKI-LAKI": "#3B82F6",
    PEREMPUAN: "#EC4899",
  },
};

export function DashboardCharts({
  mutasiCounts,
  suratCounts,
  jkCounts,
}: DashboardChartsProps) {
  // Prepare data for mutasi chart
  const mutasiData = [
    { name: "Lahir", value: mutasiCounts.LAHIR, color: COLORS.mutasi.LAHIR },
    { name: "Mati", value: mutasiCounts.MATI, color: COLORS.mutasi.MATI },
    {
      name: "Pindah Datang",
      value: mutasiCounts.PINDAH_DATANG,
      color: COLORS.mutasi.PINDAH_DATANG,
    },
    {
      name: "Pindah Keluar",
      value: mutasiCounts.PINDAH_KELUAR,
      color: COLORS.mutasi.PINDAH_KELUAR,
    },
  ].filter((item) => item.value > 0);

  // Prepare data for surat chart
  const suratData = Object.entries(suratCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for jenis kelamin chart
  const jkData = [
    {
      name: "Laki-Laki",
      value: jkCounts["LAKI-LAKI"],
      color: COLORS.jk["LAKI-LAKI"],
    },
    {
      name: "Perempuan",
      value: jkCounts.PEREMPUAN,
      color: COLORS.jk.PEREMPUAN,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mutasi Chart */}
      {mutasiData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Mutasi Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mutasiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Surat Chart */}
      {suratData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">
              Surat per Jenis (Bulan Ini)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={suratData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Jenis Kelamin Chart */}
      {jkData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">
              Komposisi Jenis Kelamin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jkData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {mutasiData.length === 0 &&
        suratData.length === 0 &&
        jkData.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">
                Belum ada data untuk ditampilkan dalam chart
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
