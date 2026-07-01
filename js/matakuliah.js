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