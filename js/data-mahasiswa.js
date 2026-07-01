let mahasiswa =
JSON.parse(localStorage.getItem("mahasiswa")) || [];

let editIndex = -1;

tampilkanMahasiswa();

function simpanMahasiswa(){

const nim =
document.getElementById("nim").value;

const nama =
document.getElementById("nama").value;

const kelas =
document.getElementById("kelas").value;

const prodi =
document.getElementById("prodi").value;

const data = {
nim,
nama,
kelas,
prodi
};

if(editIndex === -1){

mahasiswa.push(data);

}else{

mahasiswa[editIndex] = data;

editIndex = -1;

}

localStorage.setItem(
"mahasiswa",
JSON.stringify(mahasiswa)
);

resetForm();
tampilkanMahasiswa();

}

function tampilkanMahasiswa(){

const tbody =
document.getElementById("tbodyMahasiswa");

tbody.innerHTML = "";

mahasiswa.forEach((m,index)=>{

tbody.innerHTML += `
<tr>

<td>${m.nim}</td>
<td>${m.nama}</td>
<td>${m.kelas}</td>
<td>${m.prodi}</td>

<td>

<button onclick="editMahasiswa(${index})">
Edit
</button>

<button onclick="hapusMahasiswa(${index})">
Hapus
</button>

</td>

</tr>
`;

});

}

function editMahasiswa(index){

const m = mahasiswa[index];

document.getElementById("nim").value = m.nim;
document.getElementById("nama").value = m.nama;
document.getElementById("kelas").value = m.kelas;
document.getElementById("prodi").value = m.prodi;

editIndex = index;

}

function hapusMahasiswa(index){

if(confirm("Hapus Data?")){

mahasiswa.splice(index,1);

localStorage.setItem(
"mahasiswa",
JSON.stringify(mahasiswa)
);

tampilkanMahasiswa();

}

}

function resetForm(){

document.getElementById("nim").value = "";
document.getElementById("nama").value = "";
document.getElementById("kelas").value = "";
document.getElementById("prodi").value = "";

}