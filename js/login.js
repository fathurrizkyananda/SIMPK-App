const users = [
  {
    username: "mahasiswa",
    password: "123",
    role: "mahasiswa"
  },
  {
    username: "dosen",
    password: "123",
    role: "dosen"
  }
];

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("role", user.role);

    if (user.role === "mahasiswa") {
      window.location.href = "dashboard-mahasiswa.html";
    } else {
      window.location.href = "dashboard-dosen.html";
    }
  } else {
    alert("Username atau Password Salah");
  }
});