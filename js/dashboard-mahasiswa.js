const role = localStorage.getItem("role");

if(role !== "mahasiswa"){
    window.location.href = "login.html";
}

const nilaiData =
JSON.parse(localStorage.getItem("nilaiMahasiswa")) || [];

document.getElementById("totalNilai").innerText =
nilaiData.length;

document.getElementById("totalMK").innerText =
new Set(nilaiData.map(n => n.matkul)).size;

let total = 0;

nilaiData.forEach(n => {
    total += Number(n.nilaiAkhir);
});

let rata =
nilaiData.length > 0
? (total / nilaiData.length).toFixed(2)
: 0;

document.getElementById("rataRata").innerText = rata;

function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}