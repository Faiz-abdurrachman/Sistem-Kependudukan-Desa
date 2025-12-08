/**
 * Script untuk Generate Data Dummy
 * Menghasilkan file Excel dengan data dummy untuk semua fitur
 *
 * Cara pakai:
 * 1. Install dependencies: npm install xlsx
 * 2. Run script: node scripts/generate-dummy-data.js
 * 3. File akan tersimpan di: public/dummy-data.xlsx
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Helper untuk generate NIK (16 digit)
function generateNIK(index) {
  // Format: 32 (Jawa Barat) + 01 (Bogor) + 0101 (Kecamatan) + tanggal random + 4 digit urutan
  const prefix = "320101";
  const date = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  const sequence = String(index).padStart(4, "0");
  return prefix + date + sequence;
}

// Helper untuk generate Nomor KK (16 digit)
function generateKK(index) {
  const prefix = "320101";
  const date = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  const sequence = String(index).padStart(4, "0");
  return prefix + date + sequence;
}

// Helper untuk generate tanggal lahir random
function randomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDiff;
  const date = new Date(startDate.getTime() + randomTime);
  return date.toISOString().split("T")[0];
}

// Generate UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Data dummy untuk Wilayah
function generateWilayahData() {
  const wilayah = [];
  const dusunList = [
    "Dusun Krajan",
    "Dusun Sumber",
    "Dusun Pasar",
    "Dusun Kebon",
    "Dusun Sawah",
  ];
  const rwList = ["01", "02", "03", "04", "05"];
  const rtList = ["01", "02", "03", "04", "05", "06", "07", "08"];

  let idCounter = 1;

  dusunList.forEach((dusun) => {
    rwList.forEach((rw) => {
      rtList.forEach((rt) => {
        wilayah.push({
          id: `wilayah-${idCounter++}`,
          dusun: dusun,
          rw: rw,
          rt: rt,
          nama_desa: "Desa Sukamaju",
          nama_kecamatan: "Kecamatan Sukajaya",
          nama_kabupaten: "Kabupaten Bogor",
          nama_provinsi: "Jawa Barat",
        });
      });
    });
  });

  return wilayah;
}

// Data dummy untuk Kartu Keluarga
function generateKKData(wilayahData) {
  const kk = [];
  const alamatPrefix = [
    "Jl. Raya",
    "Jl. Kampung",
    "Jl. Sawah",
    "Jl. Kebon",
    "Jl. Pasar",
  ];

  wilayahData.forEach((wilayah, index) => {
    kk.push({
      id: `kk-${index + 1}`,
      nomor_kk: generateKK(index + 1),
      wilayah_id: wilayah.id,
      alamat_lengkap: `${alamatPrefix[index % alamatPrefix.length]} ${
        wilayah.dusun
      } RT ${wilayah.rt}/RW ${wilayah.rw}`,
      kepala_keluarga_id: null, // Akan diisi setelah import penduduk
      foto_scan_url: null,
    });
  });

  return kk;
}

// Data dummy untuk Penduduk
function generatePendudukData(kkData) {
  const penduduk = [];
  const namaDepan = [
    "Ahmad",
    "Siti",
    "Budi",
    "Dewi",
    "Eko",
    "Fitri",
    "Gunawan",
    "Hani",
    "Indra",
    "Joko",
    "Kartika",
    "Lukman",
    "Maya",
    "Nur",
    "Omar",
    "Putri",
    "Rudi",
    "Sari",
    "Tono",
    "Umi",
  ];
  const namaBelakang = [
    "Santoso",
    "Rahayu",
    "Wijaya",
    "Sari",
    "Prasetyo",
    "Lestari",
    "Kurniawan",
    "Sari",
    "Hidayat",
    "Sari",
    "Wulandari",
    "Setiawan",
    "Indrawati",
    "Hidayati",
    "Purnomo",
    "Sari",
    "Wibowo",
    "Sari",
    "Saputra",
    "Sari",
  ];
  const jenisKelamin = ["LAKI-LAKI", "PEREMPUAN"];
  const golDarah = ["A", "B", "AB", "O", "-"];
  const agama = ["ISLAM", "KRISTEN", "KATOLIK", "HINDU", "BUDDHA", "KONGHUCU"];
  const statusKawin = ["BELUM KAWIN", "KAWIN", "CERAI HIDUP", "CERAI MATI"];
  const shdk = [
    "KEPALA KELUARGA",
    "SUAMI",
    "ISTRI",
    "ANAK",
    "MENANTU",
    "CUCU",
    "ORANG TUA",
    "MERTUA",
    "FAMILI LAIN",
  ];
  const pendidikan = [
    "TIDAK / BELUM SEKOLAH",
    "BELUM TAMAT SD",
    "SD / SEDERAJAT",
    "SMP / SEDERAJAT",
    "SMA / SEDERAJAT",
    "D1 / D2 / D3",
    "D4 / S1",
    "S2",
    "S3",
  ];
  const pekerjaan = [
    "PNS",
    "Wiraswasta",
    "Petani",
    "Buruh",
    "Guru",
    "Dokter",
    "Perawat",
    "Pedagang",
    "Karyawan Swasta",
    "Tidak Bekerja",
    "Pelajar/Mahasiswa",
  ];
  const statusDasar = [
    "HIDUP",
    "HIDUP",
    "HIDUP",
    "HIDUP",
    "HIDUP",
    "MATI",
    "PINDAH",
  ]; // 5:1:1 ratio

  let nikCounter = 1;

  kkData.forEach((kk, kkIndex) => {
    // Setiap KK punya 3-7 anggota keluarga
    const anggotaCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < anggotaCount; i++) {
      let jenisKel =
        jenisKelamin[Math.floor(Math.random() * jenisKelamin.length)];
      const namaDepanRandom =
        namaDepan[Math.floor(Math.random() * namaDepan.length)];
      const namaBelakangRandom =
        namaBelakang[Math.floor(Math.random() * namaBelakang.length)];
      const namaLengkap = `${namaDepanRandom} ${namaBelakangRandom}`;

      // Generate tanggal lahir (usia 0-80 tahun)
      const tahunLahir = 2024 - Math.floor(Math.random() * 80);
      const bulanLahir = Math.floor(Math.random() * 12) + 1;
      const hariLahir = Math.floor(Math.random() * 28) + 1;
      const tglLahir = `${tahunLahir}-${String(bulanLahir).padStart(
        2,
        "0"
      )}-${String(hariLahir).padStart(2, "0")}`;

      // Kepala keluarga biasanya laki-laki, sudah kawin, usia 30-60
      let shdkValue = shdk[Math.floor(Math.random() * shdk.length)];
      let statusKawinValue =
        statusKawin[Math.floor(Math.random() * statusKawin.length)];

      if (i === 0) {
        shdkValue = "KEPALA KELUARGA";
        statusKawinValue = "KAWIN";
        jenisKel = "LAKI-LAKI";
      }

      penduduk.push({
        id: `penduduk-${nikCounter}`,
        kk_id: kk.id,
        nik: generateNIK(nikCounter++),
        nama_lengkap: namaLengkap,
        tempat_lahir: "Bogor",
        tgl_lahir: tglLahir,
        jenis_kelamin: jenisKel,
        gol_darah: golDarah[Math.floor(Math.random() * golDarah.length)],
        agama: agama[Math.floor(Math.random() * agama.length)],
        status_kawin: statusKawinValue,
        shdk: shdkValue,
        pendidikan: pendidikan[Math.floor(Math.random() * pendidikan.length)],
        pekerjaan: pekerjaan[Math.floor(Math.random() * pekerjaan.length)],
        nama_ayah: i === 0 ? null : `Ayah ${namaDepanRandom}`,
        nama_ibu: i === 0 ? null : `Ibu ${namaDepanRandom}`,
        status_dasar:
          statusDasar[Math.floor(Math.random() * statusDasar.length)],
        catatan: null,
      });
    }
  });

  return penduduk;
}

// Data dummy untuk Mutasi
function generateMutasiData(pendudukData) {
  const mutasi = [];
  const jenisMutasi = [
    "PINDAH MASUK",
    "PINDAH KELUAR",
    "LAHIR",
    "MATI",
    "PERUBAHAN STATUS",
  ];

  // Ambil 20% penduduk untuk mutasi
  const pendudukForMutasi = pendudukData.filter(() => Math.random() < 0.2);

  pendudukForMutasi.forEach((penduduk, index) => {
    const jenis = jenisMutasi[Math.floor(Math.random() * jenisMutasi.length)];
    const tanggalPeristiwa = randomDate("2020-01-01", "2024-12-31");

    mutasi.push({
      id: `mutasi-${index + 1}`,
      penduduk_id: penduduk.id,
      jenis_mutasi: jenis,
      tanggal_peristiwa: tanggalPeristiwa,
      keterangan: `Mutasi ${jenis} untuk ${penduduk.nama_lengkap}`,
      created_by: null, // Akan diisi oleh sistem
    });
  });

  return mutasi;
}

// Data dummy untuk Surat Keluar
function generateSuratKeluarData(pendudukData) {
  const surat = [];
  const jenisSurat = [
    "SURAT KETERANGAN DOMISILI",
    "SURAT KETERANGAN TIDAK MAMPU",
    "SURAT KETERANGAN USAHA",
    "SURAT KETERANGAN KELAKUAN BAIK",
    "SURAT PENGANTAR KTP",
  ];

  // Ambil 10% penduduk untuk surat
  const pendudukForSurat = pendudukData.filter(() => Math.random() < 0.1);

  pendudukForSurat.forEach((penduduk, index) => {
    const jenis = jenisSurat[Math.floor(Math.random() * jenisSurat.length)];
    const tanggalCetak = randomDate("2023-01-01", "2024-12-31");
    const nomorSurat = `SK/${String(index + 1).padStart(4, "0")}/${new Date(
      tanggalCetak
    ).getFullYear()}`;

    surat.push({
      id: `surat-${index + 1}`,
      penduduk_id: penduduk.id,
      jenis_surat: jenis,
      nomor_surat: nomorSurat,
      tanggal_cetak: tanggalCetak,
      keterangan: `Surat ${jenis} untuk ${penduduk.nama_lengkap}`,
      admin_id: null, // Akan diisi oleh sistem
      data_penduduk_snapshot: null, // Akan diisi oleh sistem
    });
  });

  return surat;
}

// Main function
function generateDummyData() {
  console.log("🚀 Generating dummy data...");

  // Generate data
  const wilayahData = generateWilayahData();
  console.log(`✅ Generated ${wilayahData.length} wilayah`);

  const kkData = generateKKData(wilayahData);
  console.log(`✅ Generated ${kkData.length} kartu keluarga`);

  const pendudukData = generatePendudukData(kkData);
  console.log(`✅ Generated ${pendudukData.length} penduduk`);

  const mutasiData = generateMutasiData(pendudukData);
  console.log(`✅ Generated ${mutasiData.length} mutasi`);

  const suratData = generateSuratKeluarData(pendudukData);
  console.log(`✅ Generated ${suratData.length} surat keluar`);

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets
  const wilayahSheet = XLSX.utils.json_to_sheet(wilayahData);
  XLSX.utils.book_append_sheet(workbook, wilayahSheet, "Wilayah");

  const kkSheet = XLSX.utils.json_to_sheet(kkData);
  XLSX.utils.book_append_sheet(workbook, kkSheet, "Kartu Keluarga");

  const pendudukSheet = XLSX.utils.json_to_sheet(pendudukData);
  XLSX.utils.book_append_sheet(workbook, pendudukSheet, "Penduduk");

  const mutasiSheet = XLSX.utils.json_to_sheet(mutasiData);
  XLSX.utils.book_append_sheet(workbook, mutasiSheet, "Mutasi");

  const suratSheet = XLSX.utils.json_to_sheet(suratData);
  XLSX.utils.book_append_sheet(workbook, suratSheet, "Surat Keluar");

  // Write Excel file
  const outputPath = path.join(__dirname, "../public/dummy-data.xlsx");
  XLSX.writeFile(workbook, outputPath);

  // Also generate CSV files for easier access
  const csvDir = path.join(__dirname, "../public/dummy-data-csv");
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
  }

  // Write CSV files
  const wilayahCSV = XLSX.utils.sheet_to_csv(wilayahSheet);
  fs.writeFileSync(path.join(csvDir, "wilayah.csv"), wilayahCSV);

  const kkCSV = XLSX.utils.sheet_to_csv(kkSheet);
  fs.writeFileSync(path.join(csvDir, "kartu-keluarga.csv"), kkCSV);

  const pendudukCSV = XLSX.utils.sheet_to_csv(pendudukSheet);
  fs.writeFileSync(path.join(csvDir, "penduduk.csv"), pendudukCSV);

  const mutasiCSV = XLSX.utils.sheet_to_csv(mutasiSheet);
  fs.writeFileSync(path.join(csvDir, "mutasi.csv"), mutasiCSV);

  const suratCSV = XLSX.utils.sheet_to_csv(suratSheet);
  fs.writeFileSync(path.join(csvDir, "surat-keluar.csv"), suratCSV);

  console.log(`\n✅ File Excel berhasil dibuat: ${outputPath}`);
  console.log(`✅ File CSV berhasil dibuat di: ${csvDir}`);
  console.log("\n📋 Summary:");
  console.log(`   - Wilayah: ${wilayahData.length} data`);
  console.log(`   - Kartu Keluarga: ${kkData.length} data`);
  console.log(`   - Penduduk: ${pendudukData.length} data`);
  console.log(`   - Mutasi: ${mutasiData.length} data`);
  console.log(`   - Surat Keluar: ${suratData.length} data`);
  console.log("\n💡 Tips:");
  console.log(
    "   - Jika Excel tidak bisa dibuka, gunakan file CSV di folder dummy-data-csv/"
  );
  console.log(
    "   - CSV bisa dibuka dengan Excel, Google Sheets, atau text editor"
  );
  console.log("\n📖 Baca file DUMMY_DATA_GUIDE.md untuk cara import!");
}

// Run
generateDummyData();
