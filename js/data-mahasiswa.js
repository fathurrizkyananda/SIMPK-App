// =====================================================================
// DATA-MAHASISWA.JS — CRUD Data Mahasiswa (localStorage, tanpa backend)
// =====================================================================
requireRole('dosen');

let mahasiswa = JSON.parse(localStorage.getItem('mahasiswa')) || [];
let editIndex = -1;

const form = document.getElementById('form-mahasiswa');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nim = document.getElementById('nim').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value.trim();
    const prodi = document.getElementById('prodi').value.trim();

    const nimSudahAda = mahasiswa.some((m, i) => m.nim === nim && i !== editIndex);
    if (nimSudahAda) {
        toast('NIM sudah terdaftar! Gunakan NIM lain atau edit data yang sudah ada.', 'error');
        return;
    }

    const data = { nim, nama, kelas, prodi };
    const isEdit = editIndex !== -1;

    if (!isEdit) {
        mahasiswa.push(data);
    } else {
        mahasiswa[editIndex] = data;
        editIndex = -1;
    }

    localStorage.setItem('mahasiswa', JSON.stringify(mahasiswa));
    resetForm();
    tampilkanMahasiswa();
    toast(isEdit ? 'Data mahasiswa berhasil diperbarui.' : 'Data mahasiswa berhasil disimpan.', 'success');
});

function tampilkanMahasiswa() {
    const tbody = document.getElementById('tbodyMahasiswa');
    tbody.innerHTML = '';

    document.getElementById('jumlahMahasiswa').innerText = mahasiswa.length + ' mahasiswa';

    if (mahasiswa.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Belum ada data mahasiswa</td></tr>';
        return;
    }

    mahasiswa.forEach((m, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${m.nim}</td>
                <td>${m.nama}</td>
                <td>${m.kelas}</td>
                <td>${m.prodi}</td>
                <td>
                    <button class="btn-edit" onclick="editMahasiswa(${index})">Edit</button>
                    <button class="btn-delete" onclick="hapusMahasiswa(${index})">Hapus</button>
                </td>
            </tr>`;
    });
}

function editMahasiswa(index) {
    const m = mahasiswa[index];
    document.getElementById('nim').value = m.nim;
    document.getElementById('nama').value = m.nama;
    document.getElementById('kelas').value = m.kelas;
    document.getElementById('prodi').value = m.prodi;
    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hapusMahasiswa(index) {
    const m = mahasiswa[index];
    confirmModal(`Hapus data mahasiswa <strong>${m.nama}</strong> (${m.nim})? Tindakan ini tidak dapat dibatalkan.`, () => {
        mahasiswa.splice(index, 1);
        localStorage.setItem('mahasiswa', JSON.stringify(mahasiswa));
        tampilkanMahasiswa();
        toast('Data mahasiswa berhasil dihapus.', 'success');
    }, 'Hapus Mahasiswa?');
}

function resetForm() {
    form.reset();
    editIndex = -1;
}

function exportMahasiswaCSV() {
    exportCSV(
        'data-mahasiswa.csv',
        ['NIM', 'Nama', 'Kelas', 'Prodi'],
        mahasiswa.map(m => [m.nim, m.nama, m.kelas, m.prodi])
    );
}

tampilkanMahasiswa();
liveFilterTable('searchMahasiswa', 'tbodyMahasiswa');
