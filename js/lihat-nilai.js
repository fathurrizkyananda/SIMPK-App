<<<<<<< HEAD
// =====================================================================
// LIHAT-NILAI.JS — Portal Lihat Nilai Mahasiswa (Privat & Aman)
// =====================================================================
requireRole(null); // Boleh diakses oleh mahasiswa maupun dosen yang login

const role = localStorage.getItem('role');

// 1. PENGATURAN SIDEBAR & NAVIGASI
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

document.getElementById('sidebarNav').innerHTML = role === 'dosen' ? NAV_DOSEN : NAV_MAHASISWA;
document.getElementById('sidebarRole').innerText = role === 'dosen' ? 'Portal Dosen' : 'Portal Mahasiswa';

if (document.getElementById('topbarAvatar')) {
    document.getElementById('topbarAvatar').innerText = role === 'dosen' ? 'D' : 'M';
}
if (document.getElementById('topbarRoleLabel')) {
    document.getElementById('topbarRoleLabel').innerText = role === 'dosen' ? 'Dosen' : 'Mahasiswa';
}

document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    logout(role === 'dosen' ? 'login-dosen.html' : 'login-mahasiswa.html');
});

// 2. AMBIL DATA DARI LOCALSTORAGE
const semuaNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];

// 3. FUNGSI UTAMA MENAMPILKAN DATA KE TABEL
function tampilkanDataNilai(list) {
    // Otomatis deteksi id tabel yang ada di lihat-nilai.html kalian
    const tbody = document.getElementById('tbodyNilai') || document.getElementById('tbodyLihatNilai') || document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Tampilan awal jika data kosong
    if (list.length === 0) {
        if (role === 'mahasiswa') {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888; padding: 20px;">Silakan masukkan NIM atau Nama kamu pada form di atas untuk melihat nilai privat.</td></tr>`;
        } else {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888; padding: 20px;">Tidak ada data nilai ditemukan.</td></tr>`;
        }
        return;
    }

    // Mengisi baris tabel nilai sesuai database kalian
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

// 4. LOGIKA PENCARIAN PRIVAT
// Mendeteksi otomatis form pencarian apa pun di HTML agar tidak error null
const formCari = document.getElementById('form-cari-nilai') || document.getElementById('formCariNilai') || document.querySelector('form');

if (formCari) {
    formCari.addEventListener('submit', function (e) {
        e.preventDefault();

        // Deteksi otomatis input pencarian berdasarkan ID yang kalian miliki
        const inputNim = document.getElementById('nimCari') || document.getElementById('nimRiwayat') || document.querySelector('input[placeholder*="NIM"]');
        const inputNama = document.getElementById('namaCari') || document.getElementById('namaRiwayat') || document.querySelector('input[placeholder*="Nama"]');

        const nim = inputNim ? inputNim.value.trim().toLowerCase() : '';
        const nama = inputNama ? inputNama.value.trim().toLowerCase() : '';

        // Jika form kosong, sembunyikan nilai (Privat)
        if (nim === '' && nama === '') {
            tampilkanDataNilai(role === 'mahasiswa' ? [] : semuaNilai);
            return;
        }

        // Jalankan Filter Pencarian Privat
        const hasil = semuaNilai.filter(item => {
            // Jika salah satu input kosong, buat nilainya true agar pencarian parsial berhasil
            const matchNim = nim === '' ? true : item.nim.toLowerCase().includes(nim);
            const matchNama = nama === '' ? true : item.nama.toLowerCase().includes(nama);

            // Aturan Privat Mahasiswa: Harus memenuhi input pencarian
            return matchNim && matchNama;
        });

        tampilkanDataNilai(hasil);
    });
}

// 5. INISIALISASI TAMPILAN AWAL HALAMAN LOAD
if (role === 'mahasiswa') {
    tampilkanDataNilai([]); // Halaman awal kosong (Privat)
} else {
    tampilkanDataNilai(semuaNilai); // Dosen bisa melihat rekap penuh di awal
=======
function cariNilai(){

const nim =
document.getElementById("nim").value.trim();

const nama =
document.getElementById("nama").value.trim();

const dataNilai =
JSON.parse(localStorage.getItem("nilaiMahasiswa"))
|| [];

const hasil =
dataNilai.filter(item =>

item.nim.toLowerCase() === nim.toLowerCase() &&
item.nama.toLowerCase() === nama.toLowerCase()

);

const tbody =
document.getElementById("hasilNilai");

tbody.innerHTML = "";

if(hasil.length === 0){

tbody.innerHTML =
`<tr><td colspan="6">Data Tidak Ditemukan</td></tr>`;

return;
}

hasil.forEach(item => {

tbody.innerHTML += `
<tr>
<td>${item.matkul}</td>
<td>${item.tugas}</td>
<td>${item.uts}</td>
<td>${item.uas}</td>
<td>${item.nilaiAkhir}</td>
<td>${item.grade}</td>
</tr>
`;

});

>>>>>>> ed167230191b3293826b6308cc485b4176762531
}