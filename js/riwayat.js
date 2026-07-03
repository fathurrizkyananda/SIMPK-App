// =====================================================================
// RIWAYAT.JS — Rekap seluruh riwayat nilai (localStorage)
// =====================================================================
requireRole(null); // Wajib login, boleh mahasiswa maupun dosen

const role = localStorage.getItem('role');

// ─── KONFIGURASI SIDEBAR NAVIGASI ───
const NAV_DOSEN = `
    <a href="dashboard-dosen.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="data-mahasiswa.html"><span class="icon">🎓</span> Data Mahasiswa</a>
    <a href="matakuliah.html"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="input-nilai.html"><span class="icon">📝</span> Input Nilai</a>
    <a href="riwayat.html" class="active"><span class="icon">📊</span> Riwayat Nilai</a>`;

const NAV_MAHASISWA = `
    <a href="dashboard-mahasiswa.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="lihat-nilai.html"><span class="icon">🔍</span> Lihat Nilai</a>
    <a href="matakuliah.html"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="riwayat.html" class="active"><span class="icon">📊</span> Riwayat Nilai</a>`;

// Render Komponen UI Berdasarkan Role
if (document.getElementById('sidebarNav')) {
    document.getElementById('sidebarNav').innerHTML = role === 'dosen' ? NAV_DOSEN : NAV_MAHASISWA;
}
if (document.getElementById('sidebarRole')) {
    document.getElementById('sidebarRole').innerText = role === 'dosen' ? 'Portal Dosen' : 'Portal Mahasiswa';
}
if (document.getElementById('topbarAvatar')) {
    document.getElementById('topbarAvatar').innerText = role === 'dosen' ? 'D' : 'M';
}
if (document.getElementById('topbarRoleLabel')) {
    document.getElementById('topbarRoleLabel').innerText = role === 'dosen' ? 'Dosen' : 'Mahasiswa';
}

// Fitur Logout
const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout(role === 'dosen' ? 'login-dosen.html' : 'login-mahasiswa.html');
    });
}

// ─── MANAJEMEN DATA & TABEL ───
const semuaNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];
let tampilanSaatIni = [];

// Fungsi Menampilkan Data ke Tabel
function tampilkanRiwayat(list) {
    tampilanSaatIni = list;
    const tbody = document.getElementById('tbodyRiwayat');
    const jumlahRiwayat = document.getElementById('jumlahRiwayat');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    // Jika data kosong
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888; padding: 20px;">Belum ada riwayat nilai atau data tidak ditemukan.</td></tr>`;
        if (jumlahRiwayat) jumlahRiwayat.innerText = '0 data';
        return;
    }

    if (jumlahRiwayat) jumlahRiwayat.innerText = list.length + ' data';

    // Looping data ke dalam tabel
    list.forEach((item, index) => {
        const gClass = (item.grade || '').charAt(0).toLowerCase();
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.nim}</td>
                <td>${item.nama}</td>
                <td>${item.matkul}</td>
                <td><strong>${item.nilaiAkhir}</strong></td>
                <td><span class="grade-seal ${gClass}">${item.grade}</span></td>
            </tr>`;
    });
}

// ─── FITUR PENCARIAN FLEKSIBEL ───
const formCari = document.getElementById('form-cari-riwayat');
if (formCari) {
    formCari.addEventListener('submit', function (e) {
        e.preventDefault();
        const nim = document.getElementById('nimRiwayat').value.trim().toLowerCase();
        const nama = document.getElementById('namaRiwayat').value.trim().toLowerCase();

        // Jika input kosong, kembalikan semua data
        if (nim === '' && nama === '') {
            tampilkanRiwayat(semuaNilai);
            return;
        }

        // Filter pencarian dengan kondisi AND fleksibel
        const hasil = semuaNilai.filter(item =>
            (nim === '' || item.nim.toLowerCase().includes(nim)) &&
            (nama === '' || item.nama.toLowerCase().includes(nama))
        );
        tampilkanRiwayat(hasil);
    });
}

// ─── FITUR EXPORT CSV ───
function exportRiwayatCSV() {
    if (typeof exportCSV !== 'function') {
        console.error("Fungsi exportCSV tidak ditemukan di script.js / ui.js");
        return;
    }
    exportCSV(
        'riwayat-nilai.csv',
        ['NIM', 'Nama', 'Mata Kuliah', 'Nilai Akhir', 'Grade'],
        tampilanSaatIni.map(d => [d.nim, d.nama, d.matkul, d.nilaiAkhir, d.grade])
    );
}

// ─── INISIALISASI AWAL ───
// Langsung jalankan fungsi untuk menampilkan semua data saat halaman dimuat
tampilkanRiwayat(semuaNilai);