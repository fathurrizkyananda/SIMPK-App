<<<<<<< HEAD
// =====================================================================
// MATAKULIAH.JS — CRUD Data Mata Kuliah (Dosen) / Lihat Katalog (Mahasiswa)
// =====================================================================
requireRole(null); // wajib login, boleh dosen (kelola) maupun mahasiswa (lihat saja)

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

document.getElementById('sidebarNav').innerHTML = isDosen ? NAV_DOSEN : NAV_MAHASISWA;
document.getElementById('sidebarRole').innerText = isDosen ? 'Portal Dosen' : 'Portal Mahasiswa';
document.getElementById('topbarAvatar').innerText = isDosen ? 'D' : 'M';
document.getElementById('topbarRoleLabel').innerText = isDosen ? 'Dosen' : 'Mahasiswa';
document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    logout(isDosen ? 'login-dosen.html' : 'login-mahasiswa.html');
});

// Mahasiswa hanya bisa melihat (read-only): sembunyikan form & kolom Aksi
if (!isDosen) {
    document.getElementById('formPanel').style.display = 'none';
    document.getElementById('thAksi').style.display = 'none';
    document.getElementById('topbarDesc').innerText = 'Daftar mata kuliah yang tersedia pada sistem (dikelola oleh Dosen).';
}
// ---------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------
let matakuliah = JSON.parse(localStorage.getItem('matakuliah')) || [];
let editMKIndex = -1;

const formMK = document.getElementById('form-matakuliah');
if (formMK) {
    formMK.addEventListener('submit', function (e) {
        e.preventDefault();

        const kode = document.getElementById('kode').value.trim();
        const nama = document.getElementById('namaMK').value.trim();
        const sks = document.getElementById('sks').value;
        const semester = document.getElementById('semester').value;

        const kodeSudahAda = matakuliah.some((mk, i) => mk.kode === kode && i !== editMKIndex);
        if (kodeSudahAda) {
            toast('Kode mata kuliah sudah terdaftar!', 'error');
            return;
        }

        const data = { kode, nama, sks, semester };
        const isEdit = editMKIndex !== -1;

        if (!isEdit) {
            matakuliah.push(data);
        } else {
            matakuliah[editMKIndex] = data;
            editMKIndex = -1;
        }

        localStorage.setItem('matakuliah', JSON.stringify(matakuliah));
        resetMK();
        tampilkanMK();
        toast(isEdit ? 'Mata kuliah berhasil diperbarui.' : 'Mata kuliah berhasil disimpan.', 'success');
    });
}

function tampilkanMK() {
    const tbody = document.getElementById('tbodyMK');
    tbody.innerHTML = '';

    document.getElementById('jumlahMK').innerText = matakuliah.length + ' mata kuliah';

    if (matakuliah.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Belum ada data mata kuliah${isDosen ? '' : ' yang ditambahkan Dosen'}</td></tr>`;
        return;
    }

    matakuliah.forEach((mk, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${mk.kode}</td>
                <td>${mk.nama}</td>
                <td>${mk.sks}</td>
                <td>${mk.semester}</td>
                <td ${isDosen ? '' : 'style="display:none;"'}>
                    <button class="btn-edit" onclick="editDataMK(${index})">Edit</button>
                    <button class="btn-delete" onclick="hapusMK(${index})">Hapus</button>
                </td>
            </tr>`;
    });
}

function editDataMK(index) {
    const mk = matakuliah[index];
    document.getElementById('kode').value = mk.kode;
    document.getElementById('namaMK').value = mk.nama;
    document.getElementById('sks').value = mk.sks;
    document.getElementById('semester').value = mk.semester;
    editMKIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hapusMK(index) {
    const mk = matakuliah[index];
    confirmModal(`Hapus mata kuliah <strong>${mk.nama}</strong> (${mk.kode})?`, () => {
        matakuliah.splice(index, 1);
        localStorage.setItem('matakuliah', JSON.stringify(matakuliah));
        tampilkanMK();
        toast('Mata kuliah berhasil dihapus.', 'success');
    }, 'Hapus Mata Kuliah?');
}

function resetMK() {
    if (formMK) formMK.reset();
    editMKIndex = -1;
}

function exportMKCSV() {
    exportCSV(
        'data-matakuliah.csv',
        ['Kode', 'Nama', 'SKS', 'Semester'],
        matakuliah.map(mk => [mk.kode, mk.nama, mk.sks, mk.semester])
    );
}

tampilkanMK();
liveFilterTable('searchMK', 'tbodyMK');
=======
let matakuliah =
JSON.parse(localStorage.getItem("matakuliah")) || [];

let editMK = -1;

tampilkanMK();

function simpanMK(){

const kode =
document.getElementById("kode").value;

const nama =
document.getElementById("namaMK").value;

const sks =
document.getElementById("sks").value;

const semester =
document.getElementById("semester").value;

const data = {

kode,
nama,
sks,
semester

};

if(editMK === -1){

matakuliah.push(data);

}else{

matakuliah[editMK] = data;

editMK = -1;

}

localStorage.setItem(
"matakuliah",
JSON.stringify(matakuliah)
);

resetMK();
tampilkanMK();

}

function tampilkanMK(){

const tbody =
document.getElementById("tbodyMK");

tbody.innerHTML = "";

matakuliah.forEach((mk,index)=>{

tbody.innerHTML += `
<tr>

<td>${mk.kode}</td>
<td>${mk.nama}</td>
<td>${mk.sks}</td>
<td>${mk.semester}</td>

<td>

<button onclick="editDataMK(${index})">
Edit
</button>

<button onclick="hapusMK(${index})">
Hapus
</button>

</td>

</tr>
`;

});

}

function editDataMK(index){

const mk = matakuliah[index];

document.getElementById("kode").value =
mk.kode;

document.getElementById("namaMK").value =
mk.nama;

document.getElementById("sks").value =
mk.sks;

document.getElementById("semester").value =
mk.semester;

editMK = index;

}

function hapusMK(index){

if(confirm("Hapus Data?")){

matakuliah.splice(index,1);

localStorage.setItem(
"matakuliah",
JSON.stringify(matakuliah)
);

tampilkanMK();

}

}

function resetMK(){

document.getElementById("kode").value = "";
document.getElementById("namaMK").value = "";
document.getElementById("sks").value = "";
document.getElementById("semester").value = "";

}
>>>>>>> ed167230191b3293826b6308cc485b4176762531
