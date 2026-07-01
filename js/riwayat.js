const data =
JSON.parse(localStorage.getItem("nilaiMahasiswa"))
|| [];

const tbody =
document.getElementById("tbodyRiwayat");

tbody.innerHTML = "";

data.forEach((item,index)=>{

tbody.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${item.nim}</td>
<td>${item.nama}</td>
<td>${item.matkul}</td>
<td>${item.nilaiAkhir}</td>
<td>${item.grade}</td>
</tr>
`;

});