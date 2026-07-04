// =====================================================================
// INPUT-NILAI.JS — Input nilai dengan bobot Tugas/UTS/UAS (localStorage)
// =====================================================================
requireRole('dosen');

let dataNilai = JSON.parse(localStorage.getItem('nilaiMahasiswa')) || [];
let editIndex = -1;

const formNilai = document.getElementById('form-nilai');

// ---------------------------------------------------------------------
// LOAD DROPDOWN KELAS (dari data mahasiswa yang sudah didaftarkan)
// ---------------------------------------------------------------------
function loadKelas() {
    const selectKelas = document.getElementById('kelas');

    // Mengisi dropdown hanya dengan opsi Kelas A
    selectKelas.innerHTML = `
        <option value="">Pilih Kelas</option>
        <option value="A">Kelas A</option>
         <option value="B">Kelas B</option>
    `;
}

// ---------------------------------------------------------------------
// LOAD DROPDOWN MATA KULIAH
// ---------------------------------------------------------------------
function loadMatkul() {
    const daftarMK = JSON.parse(localStorage.getItem('matakuliah')) || [];
    const selectMK = document.getElementById('matkul');

    selectMK.innerHTML = '<option value="">Pilih Mata Kuliah</option>';
    daftarMK.forEach(mk => {
        selectMK.innerHTML += `<option value="${mk.nama}">${mk.nama}</option>`;
    });
}

// ---------------------------------------------------------------------
// AUTO-ISI NAMA & KELAS SAAT NIM DIKETIK
// ---------------------------------------------------------------------
document.getElementById('nim').addEventListener('blur', function () {
    const mahasiswa = JSON.parse(localStorage.getItem('mahasiswa')) || [];
    const m = mahasiswa.find(x => x.nim === this.value.trim());
    if (m) {
        document.getElementById('nama').value = m.nama;
        document.getElementById('kelas').value = m.kelas;
    }
});

// ---------------------------------------------------------------------
// HITUNG GRADE
// ---------------------------------------------------------------------
function hitungGrade(nilai) {
    if (nilai >= 85) return 'A';
    if (nilai >= 80) return 'A-';
    if (nilai >= 75) return 'B+';
    if (nilai >= 70) return 'B';
    if (nilai >= 65) return 'C+';
    if (nilai >= 60) return 'C';
    return 'D';
}

// ---------------------------------------------------------------------
// SIMPAN NILAI
// ---------------------------------------------------------------------
formNilai.addEventListener('submit', function (e) {
    e.preventDefault();

    const nim = document.getElementById('nim').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    const matkul = document.getElementById('matkul').value;

    const tugas = Number(document.getElementById('tugas').value);
    const uts = Number(document.getElementById('uts').value);
    const uas = Number(document.getElementById('uas').value);

    const bobotTugas = Number(document.getElementById('bobotTugas').value);
    const bobotUTS = Number(document.getElementById('bobotUTS').value);
    const bobotUAS = Number(document.getElementById('bobotUAS').value);

    if (!nim || !nama || !kelas || !matkul) {
        toast('Lengkapi data terlebih dahulu!', 'error');
        return;
    }

    if (bobotTugas + bobotUTS + bobotUAS !== 100) {
        toast('Total bobot Tugas + UTS + UAS harus 100%!', 'error');
        return;
    }

    const nilaiAkhir = (tugas * bobotTugas / 100) + (uts * bobotUTS / 100) + (uas * bobotUAS / 100);
    const grade = hitungGrade(nilaiAkhir);

    const data = { nim, nama, kelas, matkul, tugas, uts, uas, nilaiAkhir: nilaiAkhir.toFixed(2), grade };
    const isEdit = editIndex !== -1;

    if (!isEdit) {
        dataNilai.push(data);
    } else {
        dataNilai[editIndex] = data;
        editIndex = -1;
    }

    localStorage.setItem('nilaiMahasiswa', JSON.stringify(dataNilai));
    tampilkanData();
    resetForm();
    toast(isEdit ? 'Nilai berhasil diperbarui.' : 'Nilai berhasil disimpan.', 'success');
});

// ---------------------------------------------------------------------
// TAMPILKAN DATA
// ---------------------------------------------------------------------
function tampilkanData() {
    const tbody = document.getElementById('tbodyNilai');
    tbody.innerHTML = '';

    document.getElementById('jumlahNilai').innerText = dataNilai.length + ' data';

    if (dataNilai.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="10">Belum Ada Data Nilai</td></tr>';
        return;
    }

    dataNilai.forEach((item, index) => {
        const gClass = (item.grade || '').charAt(0).toLowerCase();
        tbody.innerHTML += `
            <tr>
                <td>${item.nim}</td>
                <td>${item.nama}</td>
                <td>${item.kelas}</td>
                <td>${item.matkul}</td>
                <td>${item.tugas}</td>
                <td>${item.uts}</td>
                <td>${item.uas}</td>
                <td><strong>${item.nilaiAkhir}</strong></td>
                <td><span class="grade-seal ${gClass}">${item.grade}</span></td>
                <td>
                    <button class="btn-edit" onclick="editData(${index})">Edit</button>
                    <button class="btn-delete" onclick="hapusData(${index})">Hapus</button>
                </td>
            </tr>`;
    });
}

// ---------------------------------------------------------------------
// EDIT DATA
// ---------------------------------------------------------------------
function editData(index) {
    const data = dataNilai[index];

    document.getElementById('nim').value = data.nim;
    document.getElementById('nama').value = data.nama;
    document.getElementById('kelas').value = data.kelas;
    document.getElementById('matkul').value = data.matkul;
    document.getElementById('tugas').value = data.tugas;
    document.getElementById('uts').value = data.uts;
    document.getElementById('uas').value = data.uas;

    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------------------------------------------------------------
// HAPUS DATA
// ---------------------------------------------------------------------
function hapusData(index) {
    const item = dataNilai[index];
    confirmModal(`Hapus nilai <strong>${item.nama}</strong> untuk mata kuliah <strong>${item.matkul}</strong>?`, () => {
        dataNilai.splice(index, 1);
        localStorage.setItem('nilaiMahasiswa', JSON.stringify(dataNilai));
        tampilkanData();
        toast('Data nilai berhasil dihapus.', 'success');
    }, 'Hapus Nilai?');
}

// ---------------------------------------------------------------------
// RESET FORM
// ---------------------------------------------------------------------
function resetForm() {
    formNilai.reset();
    document.getElementById('bobotTugas').value = 20;
    document.getElementById('bobotUTS').value = 30;
    document.getElementById('bobotUAS').value = 50;
    editIndex = -1;
}

// ---------------------------------------------------------------------
// EXPORT CSV
// ---------------------------------------------------------------------
function exportNilaiCSV() {
    exportCSV(
        'data-nilai.csv',
        ['NIM', 'Nama', 'Kelas', 'Mata Kuliah', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir', 'Grade'],
        dataNilai.map(d => [d.nim, d.nama, d.kelas, d.matkul, d.tugas, d.uts, d.uas, d.nilaiAkhir, d.grade])
    );
}

// ---------------------------------------------------------------------
// LOAD AWAL
// ---------------------------------------------------------------------
loadKelas();
loadMatkul();
tampilkanData();
liveFilterTable('searchNilai', 'tbodyNilai');
