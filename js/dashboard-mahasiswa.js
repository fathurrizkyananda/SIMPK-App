// =====================================================================
// DASHBOARD-MAHASISWA.JS
// =====================================================================
requireRole('mahasiswa');

// Portal mahasiswa memakai 1 akun BERSAMA untuk semua mahasiswa (bukan
// 1 akun per-NIM lagi), sehingga dashboard menampilkan ringkasan SELURUH
// data nilai yang sudah diinput Dosen. Untuk melihat nilai milik NIM/Nama
// tertentu, mahasiswa mencarinya lewat menu "Lihat Nilai" / "Riwayat Nilai".
document.getElementById('welcomeName').innerText = 'Mahasiswa';

const semuaNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];

document.getElementById('totalNilai').innerText = semuaNilai.length;
document.getElementById('totalMK').innerText = new Set(semuaNilai.map(n => n.matkul)).size;

let total = 0;
semuaNilai.forEach(n => { total += Number(n.nilaiAkhir); });

const rata = semuaNilai.length > 0 ? (total / semuaNilai.length).toFixed(2) : '0.00';
document.getElementById('rataRata').innerText = rata;

renderGradeChart('gradeChart', semuaNilai);
