/**
 * Utility functions untuk import data dari Excel/CSV
 */

import * as XLSX from "xlsx";

/**
 * Parse Excel file ke JSON
 */
export function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(
          new Error("Gagal membaca file Excel: " + (error as Error).message)
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse CSV file ke JSON
 */
export function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length === 0) {
          resolve([]);
          return;
        }

        // Parse header
        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/^"|"$/g, ""));

        // Parse data rows
        const data = lines.slice(1).map((line) => {
          const values = line
            .split(",")
            .map((v) => v.trim().replace(/^"|"$/g, ""));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          return row;
        });

        resolve(data);
      } catch (error) {
        reject(
          new Error("Gagal membaca file CSV: " + (error as Error).message)
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Parse file (auto-detect Excel atau CSV)
 */
export async function parseFile(file: File): Promise<any[]> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "xlsx" || extension === "xls") {
    return parseExcelFile(file);
  } else if (extension === "csv") {
    return parseCSVFile(file);
  } else {
    throw new Error(
      "Format file tidak didukung. Gunakan Excel (.xlsx, .xls) atau CSV (.csv)"
    );
  }
}
