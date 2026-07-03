// =====================================================================
// LIHAT-NILAI.JS — Portal Lihat Nilai Mahasiswa (Privat & Aman)
// Berkas ini dipegang dan dikembangkan oleh: Anggie
// =====================================================================
requireRole(null); // Boleh diakses oleh mahasiswa maupun dosen yang login

const role = localStorage.getItem('role');

// 1. PENGATURAN SIDEBAR & NAVIGASI DINAMIS
const NAV_DOSEN = `
    <a href="dashboard-dosen.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="data-mahasiswa.html"><span class="icon">🎓</span> Data Mahasiswa</a>
    <a href="matakuliah.html"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="input-nilai.html"><span class="icon">📝</span> Input Nilai</a>
    <a href="riwayat.html"><span class="icon">📊</span> Riwayat Nilai</a>`;

const NAV_MAHASISWA = `
    <a href="dashboard-mahasiswa.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="lihat-nilai.html" class="active"><span class="icon">🔍</span> Lihat Nilai</a>
    <a href="matakuliah.html"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="riwayat.html"><span class="icon">📊</span> Riwayat Nilai</a>`;

const sidebarNav = document.getElementById('sidebarNav');
if (sidebarNav) {
    sidebarNav.innerHTML = role === 'dosen' ? NAV_DOSEN : NAV_MAHASISWA;
}

const sidebarRole = document.getElementById('sidebarRole');
if (sidebarRole) {
    sidebarRole.innerText = role === 'dosen' ? 'Portal Dosen' : 'Portal Mahasiswa';
}

if (document.getElementById('topbarAvatar')) {
    document.getElementById('topbarAvatar').innerText = role === 'dosen' ? 'D' : 'M';
}
if (document.getElementById('topbarRoleLabel')) {
    document.getElementById('topbarRoleLabel').innerText = role === 'dosen' ? 'Dosen' : 'Mahasiswa';
}

const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout(role === 'dosen' ? 'login-dosen.html' : 'login-mahasiswa.html');
    });
}

// 2. AMBIL DATA DARI LOCALSTORAGE
const semuaNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];

// 3. FUNGSI UTAMA MENAMPILKAN DATA KE TABEL
function tampilkanDataNilai(list) {
    // Deteksi otomatis id tabel yang ada di HTML Anda
    const tbody = document.getElementById('tbodyNilai') || document.getElementById('tbodyLihatNilai') || document.getElementById('hasilNilai') || document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Tampilan awal jika data kosong
    if (list.length === 0) {
        if (role === 'mahasiswa') {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888; padding: 20px;">Silakan masukkan NIM dan Nama kamu pada form di atas untuk melihat nilai privat.</td></tr>`;
        } else {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888; padding: 20px;">Tidak ada data nilai ditemukan.</td></tr>`;
        }
        return;
    }

    // Mengisi baris tabel nilai sesuai database localStorage
    list.forEach((item) => {
        const gClass = (item.grade || '').charAt(0).toLowerCase();
        tbody.innerHTML += `
            <tr>
                <td>${item.nim}</td>
                <td>${item.nama}</td>
                <td>${item.kelas || '-'}</td>
                <td>${item.matkul}</td>
                <td>${item.tugas || 0}</td>
                <td>${item.uts || 0}</td>
                <td>${item.uas || 0}</td>
                <td><strong>${item.nilaiAkhir}</strong></td>
                <td><span class="grade-seal ${gClass}">${item.grade || '-'}</span></td>
            </tr>`;
    });
}

// 4. LOGIKA PENCARIAN PRIVAT (Digunakan oleh Mahasiswa/Dosen)
const formCari = document.getElementById('form-cari-nilai') || document.getElementById('formCariNilai') || document.querySelector('form');

if (formCari) {
    formCari.addEventListener('submit', function (e) {
        e.preventDefault();

        // Deteksi input form pencarian berdasarkan ID yang ada di elemen HTML kalian
        const inputNim = document.getElementById('nimCari') || document.getElementById('nimRiwayat') || document.getElementById('nim') || document.querySelector('input[placeholder*="NIM"]');
        const inputNama = document.getElementById('namaCari') || document.getElementById('namaRiwayat') || document.getElementById('nama') || document.querySelector('input[placeholder*="Nama"]');

        const nim = inputNim ? inputNim.value.trim().toLowerCase() : '';
        const nama = inputNama ? inputNama.value.trim().toLowerCase() : '';

        // Jika form kosong, sembunyikan nilai khusus untuk peran mahasiswa
        if (nim === '' && nama === '') {
            tampilkanDataNilai(role === 'mahasiswa' ? [] : semuaNilai);
            return;
        }

        // Jalankan Filter Pencarian Privat
        const hasil = semuaNilai.filter(item => {
            const matchNim = nim === '' ? true : item.nim.toLowerCase() === nim;
            const matchNama = nama === '' ? true : item.nama.toLowerCase().includes(nama);
            return matchNim && matchNama;
        });

        tampilkanDataNilai(hasil);
    });
}

// 5. INISIALISASI TAMPILAN AWAL SEBELUM FORM DICARI
if (role === 'mahasiswa') {
    tampilkanDataNilai([]); // Halaman awal kosong demi keamanan privasi mahasiswa
} else {
    tampilkanDataNilai(semuaNilai); // Sisi dosen bisa langsung melihat rekap penuh data nilai
}