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

}