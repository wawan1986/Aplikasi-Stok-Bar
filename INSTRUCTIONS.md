# Petunjuk Pengaturan Aplikasi Manajemen Stok dengan Google Sheets

Ikuti langkah-langkah ini dengan saksama untuk menghubungkan aplikasi dengan Google Spreadsheet Anda. Proses ini akan mengubah spreadsheet Anda menjadi sebuah database sederhana untuk aplikasi.

## Langkah 1: Siapkan Google Spreadsheet Anda

1.  **Buat Spreadsheet Baru:**
    *   Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru.
    *   Beri nama spreadsheet ini, misalnya `Database Manajemen Stok`.

2.  **Buat Tiga Tab (Sheet):**
    *   Di bagian bawah, Anda akan melihat satu tab bernama `Sheet1`. Ubah namanya menjadi `Stock`.
    *   Klik tombol `+` untuk menambahkan tab baru. Beri nama `Transactions`.
    *   Klik tombol `+` lagi untuk menambahkan tab ketiga. Beri nama `Users`.
    *   Pastikan nama tab sama persis (termasuk huruf besar/kecil).

3.  **Siapkan Header Kolom:**
    *   Salin dan tempel header berikut ke baris pertama di setiap tab yang sesuai. **PENTING:** Header harus sama persis seperti di bawah ini.

    *   **Di tab `Stock` (Baris 1):**
        ```
        id | name | stockIn | stockOut | quantity | unit | minStock | stockType
        ```
        *Tempel ini di sel A1, maka setiap kata akan masuk ke kolom A, B, C, dst.*

    *   **Di tab `Transactions` (Baris 1):**
        ```
        id | itemId | itemName | amount | unit | type | timestamp
        ```

    *   **Di tab `Users` (Baris 1):**
        ```
        username | password | role
        ```

4.  **Tambahkan Data Awal untuk Owner:**
    *   Di tab `Users`, isi baris kedua (di bawah header) untuk membuat akun Owner pertama Anda.
    *   **username:** `owner` (atau username pilihan Anda)
    *   **password:** `password` (pilih password yang aman)
    *   **role:** `owner`

## Langkah 2: Atur Kolom Stok Terkini (PENTING!)

Dalam arsitektur baru ini, aplikasi tidak lagi mengubah jumlah stok secara langsung. Sebaliknya, spreadsheet akan menghitungnya secara otomatis berdasarkan riwayat transaksi.

1.  **Buka tab `Stock`.**
2.  **Salin dan tempel formula berikut** ke dalam sel yang sesuai:
    *   Klik pada sel **C2** (di bawah header `stockIn`), tempel formula ini:
        ```excel
        =SUMIFS(Transactions!D:D, Transactions!B:B, A2, Transactions!F:F, "in")
        ```
    *   Klik pada sel **D2** (di bawah header `stockOut`), tempel formula ini:
        ```excel
        =SUMIFS(Transactions!D:D, Transactions!B:B, A2, Transactions!F:F, "out")
        ```
    *   Klik pada sel **E2** (di bawah header `quantity`), tempel formula ini:
        ```excel
        =C2-D2
        ```
        
3.  **Seret Formula ke Bawah:** Setelah menempel formula di C2, D2, dan E2, pilih ketiga sel tersebut (C2 sampai E2). Anda akan melihat kotak kecil di sudut kanan bawah sel E2. Klik dan seret kotak tersebut ke bawah untuk menerapkan semua formula pada baris-baris berikutnya.

**Cara kerja formula:**
*   `stockIn` & `stockOut`: Menjumlahkan semua transaksi masuk/keluar untuk setiap item dari tab `Transactions`.
*   `quantity`: Menghitung selisih antara `stockIn` dan `stockOut` untuk mendapatkan stok terkini.

## Langkah 3: Deploy Google Apps Script

Ini akan membuat API yang aman sebagai jembatan antara aplikasi dan spreadsheet Anda.

1.  **Buka Editor Script:**
    *   Di Spreadsheet Anda, klik menu `Extensions` > `Apps Script`.

2.  **Salin Kode Script:**
    *   Hapus semua kode default yang ada di dalam file `Code.gs`.
    *   Buka file `googleAppsScript.js` yang ada di proyek aplikasi ini.
    *   Salin **seluruh isi** dari `googleAppsScript.js` dan tempel ke dalam editor `Code.gs` yang kosong.

3.  **Deploy sebagai Web App:**
    *   Di kanan atas editor Apps Script, klik tombol biru `Deploy`.
    *   Pilih `New deployment`.
    *   Klik ikon gerigi di sebelah "Select type", dan pilih `Web app`.
    *   Isi konfigurasi berikut:
        *   **Execute as:** `Me` (Akun Google Anda)
        *   **Who has access:** `Anyone`

    *   Klik `Deploy`.

4.  **Otorisasi Script:**
    *   Google akan meminta izin. Klik `Authorize access`.
    *   Pilih akun Google Anda.
    *   Klik `Advanced`, lalu klik `Go to [Nama Proyek Anda] (unsafe)`.
    *   Klik `Allow`.

5.  **Salin URL Web App:**
    *   Setelah deployment berhasil, salin **Web app URL** yang muncul.

## Langkah 4: Hubungkan Aplikasi ke API

1.  Buka file `hooks/useStock.ts`, `hooks/useTransactions.ts`, dan `hooks/useAuth.ts`.
2.  Di setiap file, cari baris `const SCRIPT_URL = ...;` dan ganti URL di dalamnya dengan URL yang baru saja Anda salin.

**Selesai!**

Refresh aplikasi Anda dan login. Aplikasi sekarang akan membaca nilai yang dihitung oleh formula Anda dan hanya akan mengirim data transaksi baru ke spreadsheet.