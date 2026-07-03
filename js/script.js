// =====================================================================
// SCRIPT.JS — Pusat Autentikasi & Helper Bersama (Semua Halaman)
// =====================================================================

// Akun demo (Sesuai ketentuan tugas, menggunakan LocalStorage)
const DOSEN_ACCOUNT = { nidn: '12345', pass: 'dosen123' };
const MHS_ACCOUNT = { pass: 'mhs123' }; // Semua NIM menggunakan password ini

// ---------------------------------------------------------------------
// LOGIN MAHASISWA
// ---------------------------------------------------------------------
const formLoginMhs = document.getElementById('form-login-mhs');
if (formLoginMhs) {
    formLoginMhs.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Mengambil elemen input secara dinamis (mendukung id 'login_nim' atau 'login_username')
        const inputNim = document.getElementById('login_nim') || document.getElementById('login_username');
        const inputPass = document.getElementById('login_pass_mhs');

        if (!inputNim || !inputPass) return;

        const nim = inputNim.value.trim();
        const pass = inputPass.value;

        // Validasi: Password harus 'mhs123' dan NIM tidak boleh kosong
        if (nim !== '' && pass === MHS_ACCOUNT.pass) {
            localStorage.setItem('role', 'mahasiswa');
            localStorage.setItem('session_nim', nim);
            localStorage.setItem('session_nama', 'Mahasiswa (' + nim + ')');
            
            alert('Login Mahasiswa Berhasil!');
            window.location.href = 'dashboard-mahasiswa.html';
        } else {
            alert('Login Gagal! Pastikan NIM terisi dan Password adalah "mhs123"');
        }
    });
}

// ---------------------------------------------------------------------
// LOGIN DOSEN
// ---------------------------------------------------------------------
const formLoginDosen = document.getElementById('form-login-dosen');
if (formLoginDosen) {
    formLoginDosen.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const inputNidn = document.getElementById('login_nidn');
        const inputPass = document.getElementById('login_pass_dosen');

        if (!inputNidn || !inputPass) return;

        const nidn = inputNidn.value.trim();
        const pass = inputPass.value;

        if (nidn === DOSEN_ACCOUNT.nidn && pass === DOSEN_ACCOUNT.pass) {
            localStorage.setItem('role', 'dosen');
            window.location.href = 'dashboard-dosen.html';
        } else {
            alert('Gagal! NIDN atau Password Dosen salah. (Demo: NIDN 12345 / dosen123)');
        }
    });
}

// ---------------------------------------------------------------------
// HELPER: PROTEKSI HALAMAN BERDASARKAN ROLE
// ---------------------------------------------------------------------
function requireRole(role) {
    const currentRole = localStorage.getItem('role');

    if (role && currentRole !== role) {
        alert('Silakan login terlebih dahulu untuk mengakses halaman ini.');
        window.location.href = role === 'dosen' ? 'login-dosen.html' : 'login-mahasiswa.html';
        return false;
    }
    if (!role && !currentRole) {
        alert('Silakan login terlebih dahulu untuk mengakses halaman ini.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ---------------------------------------------------------------------
// LOGOUT GLOBAL (Bisa dipanggil di onclick HTML)
// ---------------------------------------------------------------------
function logout(redirectUrl) {
    localStorage.removeItem('role');
    localStorage.removeItem('session_nim');
    localStorage.removeItem('session_nama');
    window.location.href = redirectUrl || 'index.html';
}

// Menghubungkan ke tombol logout mahasiswa jika ada di DOM
const btnLogoutMhs = document.getElementById('btn-logout-mhs');
if (btnLogoutMhs) {
    btnLogoutMhs.addEventListener('click', function() {
        logout('login-mahasiswa.html');
    });
}

// ---------------------------------------------------------------------
// LOGIC DOSEN: INPUT NILAI
// ---------------------------------------------------------------------
const formInputDosen = document.getElementById('form-input-dosen');
if (formInputDosen) {
    formInputDosen.addEventListener('submit', function (e) {
        e.preventDefault();

        const nama = document.getElementById('in_nama').value.trim();
        const nim = document.getElementById('in_nim').value.trim();
        const mk = document.getElementById('in_mk').value;
        const nilai = document.getElementById('in_nilai').value;
        const grade = document.getElementById('in_grade').value;
        const status = (grade === 'D' || grade === 'E') ? '✗ Mengulang' : '✓ Lulus';

        // Simpan data ke localStorage menggunakan key unik per NIM
        const dataNilai = { nama, nim, mk, nilai, grade, status };
        localStorage.setItem('nilai_' + nim, JSON.stringify(dataNilai));

        alert(`SUKSES! Nilai untuk NIM ${nim} berhasil disimpan.`);
        formInputDosen.reset();
    });
}

// ---------------------------------------------------------------------
// LOGIC MAHASISWA: TAMPILKAN NILAI
// ---------------------------------------------------------------------
const tabelBody = document.getElementById('tabel_nilai_body');
if (tabelBody) {
    const sessionNim = localStorage.getItem('session_nim');
    
    if (!sessionNim) {
        alert('Anda belum login! Kembali ke halaman login.');
        window.location.href = 'login-mahasiswa.html';
    } else {
        // Cari nilai berdasarkan NIM yang sedang login
        const dataString = localStorage.getItem('nilai_' + sessionNim);
        
        const elWelcome = document.getElementById('mhs_welcome_name');
        const elOutNama = document.getElementById('mhs_out_nama');
        const elOutNim = document.getElementById('mhs_out_nim');

        if (dataString) {
            const data = JSON.parse(dataString);
            
            // Tampilkan identitas mahasiswa
            if (elWelcome) elWelcome.innerText = data.nama;
            if (elOutNama) elOutNama.innerText = data.nama;
            if (elOutNim) elOutNim.innerText = data.nim;

            // Buat baris tabel secara dinamis
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
            
            tabelBody.innerHTML = ''; // Bersihkan teks "Belum ada nilai"
            tabelBody.appendChild(tr);
        } else {
            // Jika dosen belum menginputkan nilai untuk NIM tersebut
            if (elOutNim) elOutNim.innerText = sessionNim;
            if (elWelcome) elWelcome.innerText = "Mahasiswa";
        }
    }
}