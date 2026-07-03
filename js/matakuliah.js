// =====================================================================
// MATAKULIAH.JS — CRUD Data Mata Kuliah (Dosen) / Lihat Katalog (Mahasiswa)
// =====================================================================
requireRole(null); // Wajib login, boleh dosen (kelola) maupun mahasiswa (lihat saja)

const role = localStorage.getItem('role');
const isDosen = role === 'dosen';

// ---------------------------------------------------------------------
// SIDEBAR & TOPBAR DINAMIS BERDASARKAN ROLE
// ---------------------------------------------------------------------
const NAV_DOSEN = `
    <a href="dashboard-dosen.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="data-mahasiswa.html"><span class="icon">🎓</span> Data Mahasiswa</a>
    <a href="matakuliah.html" class="active"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="input-nilai.html"><span class="icon">📝</span> Input Nilai</a>
    <a href="riwayat.html"><span class="icon">📊</span> Riwayat Nilai</a>`;

const NAV_MAHASISWA = `
    <a href="dashboard-mahasiswa.html"><span class="icon">🏠</span> Dashboard</a>
    <a href="lihat-nilai.html"><span class="icon">🔍</span> Lihat Nilai</a>
    <a href="matakuliah.html" class="active"><span class="icon">📚</span> Mata Kuliah</a>
    <a href="riwayat.html"><span class="icon">📊</span> Riwayat Nilai</a>`;

if (document.getElementById('sidebarNav')) {
    document.getElementById('sidebarNav').innerHTML = isDosen ? NAV_DOSEN : NAV_MAHASISWA;
}
if (document.getElementById('sidebarRole')) {
    document.getElementById('sidebarRole').innerText = isDosen ? 'Portal Dosen' : 'Portal Mahasiswa';
}
if (document.getElementById('topbarAvatar')) {
    document.getElementById('topbarAvatar').innerText = isDosen ? 'D' : 'M';
}
if (document.getElementById('topbarRoleLabel')) {
    document.getElementById('topbarRoleLabel').innerText = isDosen ? 'Dosen' : 'Mahasiswa';
}

const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout(isDosen ? 'login-dosen.html' : 'login-mahasiswa.html');
    });
}

// Mahasiswa hanya bisa melihat (read-only): sembunyikan form & kolom Aksi
if (!isDosen) {
    if (document.getElementById('formPanel')) document.getElementById('formPanel').style.display = 'none';
    if (document.getElementById('thAksi')) document.getElementById('thAksi').style.display = 'none';
    if (document.getElementById('topbarDesc')) document.getElementById('topbarDesc').innerText = 'Daftar mata kuliah yang tersedia pada sistem (dikelola oleh Dosen).';
}

// ---------------------------------------------------------------------
// CORE DATA & OPERASI CRUD
// ---------------------------------------------------------------------
let matakuliah = JSON.parse(localStorage.getItem('matakuliah')) || [];
let editMKIndex = -1; // Menyimpan index baris saat mode edit aktif (-1 artinya mode tambah baru)

const formMK = document.getElementById('form-matakuliah');
if (formMK) {
    formMK.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Ambil nilai input form
        const kode = document.getElementById('kode').value.trim();
        const nama = document.getElementById('namaMK').value.trim();
        const sks = parseInt(document.getElementById('sks').value);
        const semester = parseInt(document.getElementById('semester').value);

        // 2. Validasi input kosong / tidak valid
        if (kode === "" || nama === "" || isNaN(sks) || isNaN(semester)) {
            if (typeof toast === 'function') toast('Mohon lengkapi seluruh form data mata kuliah.', 'error');
            else alert('Mohon lengkapi seluruh form data mata kuliah.');
            return;
        }

        // 3. Validasi duplikasi kode mata kuliah
        const kodeSudahAda = matakuliah.some((mk, i) => mk.kode.toLowerCase() === kode.toLowerCase() && i !== editMKIndex);
        if (kodeSudahAda) {
            if (typeof toast === 'function') toast('Kode mata kuliah sudah terdaftar!', 'error');
            else alert('Kode mata kuliah sudah terdaftar!');
            return;
        }

        // 4. Proses simpan (Tambah baru / Edit)
        const data = { kode, nama, sks, semester };
        const isEdit = editMKIndex !== -1;

        if (!isEdit) {
            matakuliah.push(data);
        } else {
            matakuliah[editMKIndex] = data;
            editMKIndex = -1; // Kembalikan ke keadaan default
            
            // Kembalikan tulisan tombol submit
            const btnSave = formMK.querySelector('.btn-save');
            if (btnSave) btnSave.innerHTML = '💾 Simpan Mata Kuliah';
        }

        // 5. Commit ke penyimpanan internal browser & update UI
        localStorage.setItem('matakuliah', JSON.stringify(matakuliah));
        resetMK();
        tampilkanMK();
        
        if (typeof toast === 'function') {
            toast(isEdit ? 'Mata kuliah berhasil diperbarui.' : 'Mata kuliah berhasil disimpan.', 'success');
        }
    });
}

// Fungsi untuk merender list array data ke tabel HTML
function tampilkanMK() {
    const tbody = document.getElementById('tbodyMK');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (document.getElementById('jumlahMK')) {
        document.getElementById('jumlahMK').innerText = matakuliah.length + ' mata kuliah';
    }

    if (matakuliah.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="5" style="text-align:center; padding: 20px;">Belum ada data mata kuliah${isDosen ? '' : ' yang ditambahkan Dosen'}</td></tr>`;
        return;
    }

    matakuliah.forEach((mk, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${mk.kode}</strong></td>
                <td>${mk.nama}</td>
                <td>${mk.sks} SKS</td>
                <td>Semester ${mk.semester}</td>
                <td ${isDosen ? '' : 'style="display:none;"'}>
                    <button type="button" class="btn-edit" style="margin-right:4px; padding:4px 8px;" onclick="editDataMK(${index})">✏️ Edit</button>
                    <button type="button" class="btn-delete" style="padding:4px 8px; background-color:#dc3545; color:white; border:none; border-radius:4px;" onclick="hapusMK(${index})">🗑️ Hapus</button>
                </td>
            </tr>`;
    });
}

// Fungsi untuk menarik data dari tabel kembali ke form input (Mode Edit)
function editDataMK(index) {
    const mk = matakuliah[index];
    document.getElementById('kode').value = mk.kode;
    document.getElementById('namaMK').value = mk.nama;
    document.getElementById('sks').value = mk.sks;
    document.getElementById('semester').value = mk.semester;
    
    editMKIndex = index;

    // Ubah teks tombol submit
    if (formMK) {
        const btnSave = formMK.querySelector('.btn-save');
        if (btnSave) btnSave.innerHTML = '🔄 Perbarui Mata Kuliah';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fungsi menghapus baris mata kuliah
function hapusMK(index) {
    const mk = matakuliah[index];
    
    // Gunakan confirmModal bawaan ui.js jika tersedia, jika tidak pakai confirm standar browser
    if (typeof confirmModal === 'function') {
        confirmModal(`Hapus mata kuliah <strong>${mk.nama}</strong> (${mk.kode})?`, () => {
            matakuliah.splice(index, 1);
            localStorage.setItem('matakuliah', JSON.stringify(matakuliah));
            tampilkanMK();
            if (typeof toast === 'function') toast('Mata kuliah berhasil dihapus.', 'success');
        }, 'Hapus Mata Kuliah?');
    } else {
        if (confirm(`Hapus mata kuliah ${mk.nama} (${mk.kode})?`)) {
            matakuliah.splice(index, 1);
            localStorage.setItem('matakuliah', JSON.stringify(matakuliah));
            tampilkanMK();
        }
    }
}

// Fungsi pengosongan form (Tombol Batal)
function resetMK() {
    if (formMK) formMK.reset();
    editMKIndex = -1;
    const btnSave = formMK.querySelector('.btn-save');
    if (btnSave) btnSave.innerHTML = '💾 Simpan Mata Kuliah';
}

// Fungsi pengeksporan berkas .csv
function exportMKCSV() {
    if (typeof exportCSV === 'function') {
        exportCSV(
            'data-matakuliah.csv',
            ['Kode', 'Nama', 'SKS', 'Semester'],
            matakuliah.map(mk => [mk.kode, mk.nama, mk.sks, mk.semester])
        );
    } else {
        // Fallback jika helper exportCSV di ui.js tidak terdeteksi
        let csvContent = "data:text/csv;charset=utf-8,Kode,Nama,SKS,Semester\n" 
            + matakuliah.map(e => `"${e.kode}","${e.nama}",${e.sks},${e.semester}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data-matakuliah.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Jalankan fungsi tampil awal saat file dimuat browser
tampilkanMK();

if (typeof liveFilterTable === 'function') {
    liveFilterTable('searchMK', 'tbodyMK');
}