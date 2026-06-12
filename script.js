// ==========================================
// LOGIC LOGIN MAHASISWA
// ==========================================
const formLoginMhs = document.getElementById('form-login-mhs');
if (formLoginMhs) {
    formLoginMhs.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nim = document.getElementById('login_nim').value.trim();
        const pass = document.getElementById('login_pass_mhs').value;

        // Password default semua mahasiswa: mhs123
        if (nim !== '' && pass === 'mhs123') {
            localStorage.setItem('session_nim', nim);
            alert('Login Mahasiswa Berhasil!');
            window.location.href = 'dashboard-mahasiswa.html';
        } else {
            alert('Gagal! Pastikan NIM benar dan Password adalah mhs123');
        }
    });
}

// ==========================================
// LOGIC LOGIN DOSEN
// ==========================================
const formLoginDosen = document.getElementById('form-login-dosen');
if (formLoginDosen) {
    formLoginDosen.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nidn = document.getElementById('login_nidn').value.trim();
        const pass = document.getElementById('login_pass_dosen').value;

        // Hardcode Dosen (NIDN: 12345, Pass: dosen123)
        if (nidn === '12345' && pass === 'dosen123') {
            alert('Login Berhasil! Selamat Datang Dosen.');
            window.location.href = 'dashboard-dosen.html';
        } else {
            alert('Gagal! NIDN atau Password Dosen salah!');
        }
    });
}

// ==========================================
// LOGIC DOSEN INPUT NILAI
// ==========================================
const formInputDosen = document.getElementById('form-input-dosen');
if (formInputDosen) {
    formInputDosen.addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('in_nama').value.trim();
        const nim = document.getElementById('in_nim').value.trim();
        const mk = document.getElementById('in_mk').value;
        const nilai = document.getElementById('in_nilai').value;
        const grade = document.getElementById('in_grade').value;
        const status = (grade === 'D' || grade === 'E') ? '✗ Mengulang' : '✓ Lulus';

        // Simpan datanya pake KUNCI (KEY) NIM biar unik
        const dataNilai = { nama, nim, mk, nilai, grade, status };
        localStorage.setItem('nilai_' + nim, JSON.stringify(dataNilai));

        alert(`SUKSES! Nilai untuk NIM ${nim} berhasil masuk database lokal.`);
        formInputDosen.reset();
    });
}

// ==========================================
// LOGIC MAHASISWA NAMPILIN NILAI
// ==========================================
// Cek kalo kita lagi di dashboard mahasiswa
const tabelBody = document.getElementById('tabel_nilai_body');
if (tabelBody) {
    // Ambil NIM dari session yang login
    const sessionNim = localStorage.getItem('session_nim');
    
    if (!sessionNim) {
        alert('Lu belom login woy! Balik sana!');
        window.location.href = 'login.html';
    } else {
        // Cari nilai berdasarkan NIM dia
        const dataString = localStorage.getItem('nilai_' + sessionNim);
        
        if (dataString) {
            const data = JSON.parse(dataString);
            
            // Tulis identitas
            document.getElementById('mhs_welcome_name').innerText = data.nama;
            document.getElementById('mhs_out_nama').innerText = data.nama;
            document.getElementById('mhs_out_nim').innerText = data.nim;

            // Bikin baris tabel pake JS
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${data.mk}</strong></td>
                <td>
                    <div class="nilai-cell">
                        <strong>${data.nilai}</strong>
                        <div class="nilai-bar-bg" style="width:60px; height:6px; background:#e5e7eb; border-radius:3px;">
                            <div style="height:100%; border-radius:3px; background:#2563eb; width:${data.nilai}%"></div>
                        </div>
                    </div>
                </td>
                <td><span style="font-weight:bold; color:#059669;">${data.grade}</span></td>
                <td><span style="font-weight:bold; color:${data.status.includes('Mengulang') ? '#dc2626' : '#059669'}">${data.status}</span></td>
            `;
            
            tabelBody.innerHTML = ''; // Hapus teks "Belum ada nilai"
            tabelBody.appendChild(tr); // Masukin data aslinya
        } else {
            // Kalo dosen belum input nilai buat NIM ini
            document.getElementById('mhs_out_nim').innerText = sessionNim;
            document.getElementById('mhs_welcome_name').innerText = "Mahasiswa";
        }
    }
}

// LOGOUT LOGIC (Matiin session)
const btnLogoutMhs = document.getElementById('btn-logout-mhs');
if(btnLogoutMhs) {
    btnLogoutMhs.addEventListener('click', () => {
        localStorage.removeItem('session_nim');
    });
}