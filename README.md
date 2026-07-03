# SIPMK — Sistem Informasi Penilaian Mata Kuliah

Website front-end sederhana (HTML, CSS, JavaScript murni — **tanpa backend/database**)
untuk mengelola data mahasiswa, mata kuliah, dan nilai akademik. Dibuat sebagai
Tugas Proyek mata kuliah Perancangan Web.

## Kategori Proyek
Kategori 1 — Sistem Informasi: **Sistem Informasi Layanan Akademik**

## Desain
Konsep visual: **"Buku Nilai Digital"** — palet navy & emas akademik (selaras dengan
ilustrasi toga wisuda di beranda), tipografi serif **Fraunces** untuk judul dan
**Inter** untuk isi, serta **JetBrains Mono** untuk data (NIM/kode/grade). Halaman
internal (dashboard & CRUD) memakai layout **sidebar aplikasi** yang bisa dibuka-tutup
di mobile, bukan sekadar navbar atas.

## Fitur
- **Portal Dosen**
  - Login Dosen
  - Dashboard ringkasan (total mahasiswa, mata kuliah, nilai) + grafik distribusi grade
  - CRUD Data Mahasiswa (dengan pencarian & export CSV)
  - CRUD Data Mata Kuliah (dengan pencarian & export CSV)
  - Input Nilai (Tugas/UTS/UAS dengan bobot dapat diatur, nilai akhir & grade dihitung otomatis, auto-isi nama/kelas dari NIM)
- **Portal Mahasiswa** (1 akun bersama untuk SEMUA mahasiswa)
  - Login Mahasiswa dengan 1 akun bersama (bukan 1 akun per-NIM)
  - Dashboard ringkasan SELURUH nilai yang diinput Dosen (total MK, total nilai, rata-rata) + grafik distribusi grade
  - Lihat Nilai — cari nilai siapa saja berdasarkan **NIM atau Nama** (boleh isi salah satu saja)
  - Mata Kuliah (lihat katalog mata kuliah yang dikelola Dosen — read only)
  - Riwayat Nilai seluruh mahasiswa, dengan filter NIM/Nama & export CSV
- **UI/UX**
  - Notifikasi toast (pengganti `alert()`) untuk umpan balik simpan/hapus
  - Modal konfirmasi (pengganti `confirm()`) untuk aksi hapus data
  - Pencarian langsung (live search) di setiap tabel data
  - Export data ke CSV (Data Mahasiswa, Mata Kuliah, Input Nilai, Riwayat)
  - Grafik donut distribusi grade (A/B/C/D) tanpa library eksternal
  - Sidebar navigasi responsif dengan menu hamburger di mobile

## Akun Demo
| Role | Username | Password |
|------|----------|----------|
| Dosen | NIDN `12345` | `dosen123` |
| Mahasiswa | `mahasiswa` | `mhs123` |

Portal Mahasiswa hanya memakai **1 akun bersama untuk semua mahasiswa** (bukan 1
akun per-NIM lagi). Semua mahasiswa login dengan username/password yang sama di
atas, lalu mencari nilai milik NIM atau Nama mana pun (termasuk milik sendiri)
lewat halaman **Lihat Nilai** atau **Riwayat Nilai**. Data mahasiswa yang
didaftarkan Dosen lewat halaman **Data Mahasiswa** dipakai sebagai referensi
NIM/Nama/Kelas untuk pencarian tersebut, bukan sebagai akun login terpisah.

## Struktur Folder
```
├── index.html                 Halaman beranda
├── login-mahasiswa.html       Login mahasiswa
├── login-dosen.html           Login dosen
├── dashboard-mahasiswa.html   Dashboard mahasiswa
├── dashboard-dosen.html       Dashboard dosen
├── data-mahasiswa.html        CRUD data mahasiswa (dosen)
├── matakuliah.html            CRUD data mata kuliah (dosen)
├── input-nilai.html           Input nilai (dosen)
├── lihat-nilai.html           Cari nilai (mahasiswa/dosen)
├── riwayat.html                Riwayat nilai (mahasiswa/dosen)
├── css/style.css              Semua styling (termasuk responsive)
└── js/
    ├── script.js               Autentikasi & helper bersama (login, logout, proteksi halaman)
    ├── ui.js                    Komponen UI bersama (toast, modal, export CSV, grafik, sidebar)
    ├── dashboard-dosen.js
    ├── dashboard-mahasiswa.js
    ├── data-mahasiswa.js
    ├── matakuliah.js
    ├── input-nilai.js
    ├── lihat-nilai.js
    └── riwayat.js
```

## Penyimpanan Data
Karena proyek ini **tidak menggunakan backend/database** (sesuai ketentuan tugas),
semua data disimpan di `localStorage` browser:
- `mahasiswa` — daftar mahasiswa terdaftar (referensi data, bukan akun login)
- `matakuliah` — daftar mata kuliah
- `nilaiMahasiswa` — daftar nilai yang sudah diinput
- `role`, `session_nama` — status sesi login

> Data akan hilang jika localStorage browser dibersihkan (bukan bug — konsekuensi
> dari ketentuan "tanpa backend/database").

## Teknologi
HTML5 semantik, CSS3 (custom, responsive desktop & mobile), JavaScript (vanilla,
tanpa framework), Git/GitHub untuk version control.

## Cara Menjalankan
Buka `index.html` langsung di browser, atau jalankan lewat Live Server (VS Code)
untuk pengalaman terbaik.

## Anggota Kelompok & Pembagian Peran
| Nama | NIM | Peran |
|------|-----|-------|
| _(isi nama)_ | _(isi NIM)_ | _(mis. UI/UX & halaman Beranda-Login)_ |
| _(isi nama)_ | _(isi NIM)_ | _(mis. Modul Dosen: Data Mahasiswa, Mata Kuliah, Input Nilai)_ |
| _(isi nama)_ | _(isi NIM)_ | _(mis. Modul Mahasiswa: Dashboard, Lihat Nilai, Riwayat)_ |
| _(isi nama)_ | _(isi NIM)_ | _(mis. Styling CSS & Responsive, dokumentasi, video demo)_ |

## Catatan Pengembangan Lanjutan
- [x] Struktur HTML semantik & konsisten di seluruh halaman
- [x] CSS custom, responsive (desktop & mobile), 1 sistem desain terpadu
- [x] Minimal 1 form + 1 tabel di setiap modul CRUD
- [x] Interaksi JavaScript (validasi form, hitung otomatis, localStorage)
- [ ] Commit & push riwayat perubahan tiap anggota ke GitHub (kontribusi individu harus terlihat di riwayat commit)
- [ ] Rekam video demo (5–10 menit): penjelasan fitur + peran masing-masing anggota
