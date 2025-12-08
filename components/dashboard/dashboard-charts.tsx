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

  // Calculate totals for better display
  const totalMutasi = mutasiData.reduce((sum, item) => sum + item.value, 0);
  const totalSurat = suratData.reduce((sum, item) => sum + item.value, 0);
  const totalJK = jkData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Mutasi Chart - Enhanced */}
      {mutasiData.length > 0 && (
        <Card className="border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                Mutasi Bulan Ini
              </CardTitle>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {totalMutasi}
                </p>
                <p className="text-xs text-slate-400">Total Mutasi</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={mutasiData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  style={{ fontSize: "11px" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: "11px" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value} kejadian`, "Jumlah"]}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  label={{ position: "top", fill: "#F3F4F6", fontSize: 12 }}
                >
                  {mutasiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-700">
              {mutasiData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-300">{item.name}</span>
                  <span className="text-xs font-semibold text-white ml-auto">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Surat Chart - Enhanced */}
      {suratData.length > 0 && (
        <Card className="border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                Surat per Jenis
              </CardTitle>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">
                  {totalSurat}
                </p>
                <p className="text-xs text-slate-400">Total Surat</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={suratData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  style={{ fontSize: "11px" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: "11px" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value} surat`, "Jumlah"]}
                />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[8, 8, 0, 0]}
                  label={{ position: "top", fill: "#F3F4F6", fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Jenis Kelamin Chart - Enhanced */}
      {jkData.length > 0 && (
        <Card className="border-slate-700 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                Komposisi Jenis Kelamin
              </CardTitle>
              <div className="text-right">
                <p className="text-2xl font-bold text-pink-400">{totalJK}</p>
                <p className="text-xs text-slate-400">Total Penduduk</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={jkData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent, value }) =>
                        `${name}\n${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={90}
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
                        fontSize: "12px",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} orang`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats List */}
              <div className="flex flex-col justify-center space-y-4">
                {jkData.map((item, index) => {
                  const percentage =
                    totalJK > 0 ? ((item.value / totalJK) * 100).toFixed(1) : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white font-semibold">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">
                            {item.value.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-slate-400">
                            {percentage}%
                          </p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {mutasiData.length === 0 &&
        suratData.length === 0 &&
        jkData.length === 0 && (
          <Card className="col-span-1 lg:col-span-2 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 text-lg">
                Belum ada data untuk ditampilkan dalam chart
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Import data untuk melihat visualisasi
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
