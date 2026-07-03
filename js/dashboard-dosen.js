// =====================================================================
// DASHBOARD-DOSEN.JS
// =====================================================================
requireRole('dosen');

const mahasiswa = JSON.parse(localStorage.getItem('mahasiswa')) || [];
const matakuliah = JSON.parse(localStorage.getItem('matakuliah')) || [];
const nilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];

document.getElementById('statMahasiswa').innerText = mahasiswa.length;
document.getElementById('statMK').innerText = matakuliah.length;
document.getElementById('statNilai').innerText = nilai.length;

renderGradeChart('gradeChart', nilai);

