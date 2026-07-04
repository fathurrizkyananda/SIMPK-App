// =====================================================================
// RIWAYAT.JS — Rekap seluruh riwayat nilai (localStorage) - KEMBALI PUBLIK
// =====================================================================
requireRole(null); // wajib login, boleh mahasiswa maupun dosen

const role = localStorage.getItem('role');

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

document.getElementById('sidebarNav').innerHTML = role === 'dosen' ? NAV_DOSEN : NAV_MAHASISWA;
document.getElementById('sidebarRole').innerText = role === 'dosen' ? 'Portal Dosen' : 'Portal Mahasiswa';
document.getElementById('topbarAvatar').innerText = role === 'dosen' ? 'D' : 'M';
document.getElementById('topbarRoleLabel').innerText = role === 'dosen' ? 'Dosen' : 'Mahasiswa';
document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    logout(role === 'dosen' ? 'login-dosen.html' : 'login-mahasiswa.html');
});

const semuaNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];
let tampilanSaatIni = [];

function tampilkanRiwayat(list) {
    tampilanSaatIni = list;
    const tbody = document.getElementById('tbodyRiwayat');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888; padding: 20px;">Belum ada riwayat nilai atau data tidak ditemukan.</td></tr>`;
        document.getElementById('jumlahRiwayat').innerText = '0 data';
        return;
    }

    document.getElementById('jumlahRiwayat').innerText = list.length + ' data';

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

// Fitur Pencarian Fleksibel (Publik)
document.getElementById('form-cari-riwayat').addEventListener('submit', function (e) {
    e.preventDefault();
    const nim = document.getElementById('nimRiwayat').value.trim().toLowerCase();
    const nama = document.getElementById('namaRiwayat').value.trim().toLowerCase();

    // Jika input pencarian dikosongkan lalu ditekan cari, tampilkan semua data kembali
    if (nim === '' && nama === '') {
        tampilkanRiwayat(semuaNilai);
        return;
    }

    // Pencarian fleksibel menggunakan kondisi OR (||)
    const hasil = semuaNilai.filter(item =>
        (nim === '' || item.nim.toLowerCase().includes(nim)) &&
        (nama === '' || item.nama.toLowerCase().includes(nama))
    );
    tampilkanRiwayat(hasil);
});

function exportRiwayatCSV() {
    exportCSV(
        'riwayat-nilai.csv',
        ['NIM', 'Nama', 'Mata Kuliah', 'Nilai Akhir', 'Grade'],
        tampilanSaatIni.map(d => [d.nim, d.nama, d.matkul, d.nilaiAkhir, d.grade])
    );
}

// ─── TAMPILAN AWAL: LANGSUNG MUNCUL SEMUA DATA NILAI ───
tampilkanRiwayat(semuaNilai);
