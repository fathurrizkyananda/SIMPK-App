// ==========================
// DATA NILAI
// ==========================

let dataNilai =
JSON.parse(localStorage.getItem("nilaiMahasiswa")) || [];

let editIndex = -1;


// ==========================
// LOAD DROPDOWN KELAS
// ==========================

function loadKelas() {

    const mahasiswa =
    JSON.parse(localStorage.getItem("mahasiswa")) || [];

    const kelasUnik =
    [...new Set(mahasiswa.map(m => m.kelas))];

    const selectKelas =
    document.getElementById("kelas");

    selectKelas.innerHTML =
    '<option value="">Pilih Kelas</option>';

    kelasUnik.forEach(kelas => {

        selectKelas.innerHTML += `
        <option value="${kelas}">
            ${kelas}
        </option>
        `;

    });

}


// ==========================
// LOAD DROPDOWN MATA KULIAH
// ==========================

function loadMatkul() {

    const daftarMK =
    JSON.parse(localStorage.getItem("matakuliah")) || [];

    const selectMK =
    document.getElementById("matkul");

    selectMK.innerHTML =
    '<option value="">Pilih Mata Kuliah</option>';

    daftarMK.forEach(mk => {

        selectMK.innerHTML += `
        <option value="${mk.nama}">
            ${mk.nama}
        </option>
        `;

    });

}


// ==========================
// HITUNG GRADE
// ==========================

function hitungGrade(nilai) {

    if (nilai >= 85) return "A";
    if (nilai >= 80) return "A-";
    if (nilai >= 75) return "B+";
    if (nilai >= 70) return "B";
    if (nilai >= 65) return "C+";
    if (nilai >= 60) return "C";

    return "D";
}


// ==========================
// SIMPAN NILAI
// ==========================

function simpanNilai() {

    const nim =
    document.getElementById("nim").value.trim();

    const nama =
    document.getElementById("nama").value.trim();

    const kelas =
    document.getElementById("kelas").value;

    const matkul =
    document.getElementById("matkul").value;

    const tugas =
    Number(document.getElementById("tugas").value);

    const uts =
    Number(document.getElementById("uts").value);

    const uas =
    Number(document.getElementById("uas").value);

    const bobotTugas =
    Number(document.getElementById("bobotTugas").value);

    const bobotUTS =
    Number(document.getElementById("bobotUTS").value);

    const bobotUAS =
    Number(document.getElementById("bobotUAS").value);

    if (
        nim === "" ||
        nama === "" ||
        kelas === "" ||
        matkul === ""
    ) {
        alert("Lengkapi data terlebih dahulu!");
        return;
    }

    const nilaiAkhir =

        (tugas * bobotTugas / 100) +
        (uts * bobotUTS / 100) +
        (uas * bobotUAS / 100);

    const grade =
    hitungGrade(nilaiAkhir);

    const data = {

        nim,
        nama,
        kelas,
        matkul,

        tugas,
        uts,
        uas,

        nilaiAkhir:
        nilaiAkhir.toFixed(2),

        grade

    };

    if (editIndex === -1) {

        dataNilai.push(data);

    } else {

        dataNilai[editIndex] = data;

        editIndex = -1;

    }

    localStorage.setItem(
        "nilaiMahasiswa",
        JSON.stringify(dataNilai)
    );

    tampilkanData();

    resetForm();

    alert("Data berhasil disimpan!");

}


// ==========================
// TAMPILKAN DATA
// ==========================

function tampilkanData() {

    const tbody =
    document.getElementById("tbodyNilai");

    tbody.innerHTML = "";

    if (dataNilai.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="10">
                Belum Ada Data Nilai
            </td>
        </tr>
        `;

        return;
    }

    dataNilai.forEach((item, index) => {

        tbody.innerHTML += `
        <tr>

            <td>${item.nim}</td>

            <td>${item.nama}</td>

            <td>${item.kelas}</td>

            <td>${item.matkul}</td>

            <td>${item.tugas}</td>

            <td>${item.uts}</td>

            <td>${item.uas}</td>

            <td>${item.nilaiAkhir}</td>

            <td>${item.grade}</td>

            <td>

                <button
                onclick="editData(${index})">
                Edit
                </button>

                <button
                onclick="hapusData(${index})">
                Hapus
                </button>

            </td>

        </tr>
        `;

    });

}


// ==========================
// EDIT DATA
// ==========================

function editData(index) {

    const data =
    dataNilai[index];

    document.getElementById("nim").value =
    data.nim;

    document.getElementById("nama").value =
    data.nama;

    document.getElementById("kelas").value =
    data.kelas;

    document.getElementById("matkul").value =
    data.matkul;

    document.getElementById("tugas").value =
    data.tugas;

    document.getElementById("uts").value =
    data.uts;

    document.getElementById("uas").value =
    data.uas;

    editIndex = index;

}


// ==========================
// HAPUS DATA
// ==========================

function hapusData(index) {

    const konfirmasi =
    confirm("Yakin ingin menghapus data?");

    if (!konfirmasi) return;

    dataNilai.splice(index, 1);

    localStorage.setItem(
        "nilaiMahasiswa",
        JSON.stringify(dataNilai)
    );

    tampilkanData();

}


// ==========================
// RESET FORM
// ==========================

function resetForm() {

    document.getElementById("nim").value = "";
    document.getElementById("nama").value = "";

    document.getElementById("kelas").value = "";
    document.getElementById("matkul").value = "";

    document.getElementById("tugas").value = "";
    document.getElementById("uts").value = "";
    document.getElementById("uas").value = "";

}


// ==========================
// LOAD AWAL
// ==========================

loadKelas();
loadMatkul();
tampilkanData();