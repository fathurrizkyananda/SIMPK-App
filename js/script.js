// =====================================================================
// SCRIPT.JS — Pusat Autentikasi & Helper Bersama (dipakai di semua halaman)
// =====================================================================

// Akun demo (tanpa backend/database, sesuai ketentuan tugas)
const DOSEN_ACCOUNT = { nidn: '12345', pass: 'dosen123' };

// Akun Mahasiswa: HANYA 1 akun bersama untuk SEMUA mahasiswa (bukan 1 akun
// per-NIM lagi). Semua mahasiswa login memakai username & password yang
// sama ini, lalu mencari nilai siapa saja lewat menu "Lihat Nilai" /
// "Riwayat Nilai" dengan mengetikkan NIM atau Nama yang dicari.
const MHS_ACCOUNT = { username: 'mahasiswa', pass: 'mhs123' };

// ---------------------------------------------------------------------
// LOGIN MAHASISWA (1 akun bersama untuk semua mahasiswa)
// ---------------------------------------------------------------------
const formLoginMhs = document.getElementById('form-login-mhs');
if (formLoginMhs) {
    formLoginMhs.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('login_username').value.trim().toLowerCase();
        const pass = document.getElementById('login_pass_mhs').value;

        if (username === MHS_ACCOUNT.username && pass === MHS_ACCOUNT.pass) {
            localStorage.setItem('role', 'mahasiswa');
            localStorage.setItem('session_nama', 'Mahasiswa');
            window.location.href = 'dashboard-mahasiswa.html';
        } else {
            toast('Login gagal. Gunakan akun mahasiswa bersama: username "mahasiswa" / password "mhs123".', 'error');
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

        const nidn = document.getElementById('login_nidn').value.trim();
        const pass = document.getElementById('login_pass_dosen').value;

        if (nidn === DOSEN_ACCOUNT.nidn && pass === DOSEN_ACCOUNT.pass) {
            localStorage.setItem('role', 'dosen');
            window.location.href = 'dashboard-dosen.html';
        } else {
            toast('NIDN atau Password salah. Akun demo: NIDN 12345 / dosen123', 'error');
        }
    });
}

// ---------------------------------------------------------------------
// HELPER: PROTEKSI HALAMAN BERDASARKAN ROLE
// role = 'mahasiswa' | 'dosen' | null (null = cukup harus login, role apa saja)
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
// LOGOUT (dipakai lewat atribut onclick="logout('login-mahasiswa.html')")
// ---------------------------------------------------------------------
function logout(redirectUrl) {
    localStorage.removeItem('role');
    localStorage.removeItem('session_nim');
    localStorage.removeItem('session_nama');
    window.location.href = redirectUrl || 'index.html';
}
