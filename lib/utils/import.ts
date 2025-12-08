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
 * Improved CSV parser dengan support untuk quoted values dan special characters
 */
export function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        if (!text || text.trim().length === 0) {
          resolve([]);
          return;
        }

        // Split lines dengan handle untuk line breaks dalam quoted values
        const lines: string[] = [];
        let currentLine = "";
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];
          
          if (char === '"') {
            inQuotes = !inQuotes;
            currentLine += char;
          } else if (char === '\n' && !inQuotes) {
            lines.push(currentLine);
            currentLine = "";
          } else {
            currentLine += char;
          }
        }
        
        if (currentLine.trim()) {
          lines.push(currentLine);
        }

        const filteredLines = lines.filter((line) => line.trim());

        if (filteredLines.length === 0) {
          resolve([]);
          return;
        }

        // Parse header dengan proper CSV parsing
        const parseCSVLine = (line: string): string[] => {
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          return values;
        };

        const headers = parseCSVLine(filteredLines[0]).map((h) => 
          h.replace(/^"|"$/g, "").trim()
        );

        // Parse data rows
        const data = filteredLines.slice(1).map((line) => {
          const values = parseCSVLine(line).map((v) => 
            v.replace(/^"|"$/g, "").trim()
          );
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

    reader.readAsText(file, "UTF-8");
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
