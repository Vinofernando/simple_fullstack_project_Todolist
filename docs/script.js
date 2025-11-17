const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const userInfo = document.getElementById("userInfo");

function clearUserInfo() {
  userInfo.innerHTML = `
    <h3></h3>
    <p></p>
    <p></p>
  `;
  localStorage.removeItem("token");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // validasi sederhana
  if (!email || !password) {
    message.textContent = "Email dan password harus diisi!";
    return;
  }

  message.textContent = "Loading...";

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("📦 Data dari backend:", data);


    if (!response.ok) {
        message.style.color = "red"
        message.textContent = data.message || "Login gagal!";
        clearUserInfo()
      return;
    }

    // Simpan token di localStorage
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";

    // Tampilkan hasil login
    message.textContent = "Login berhasil!";
    message.style.color = "green";
    userInfo.innerHTML = `
      <h3>Halo, ${data.user.username}</h3>
      <p>Email: ${data.user.email}</p>
      <p><strong>Token:</strong> ${data.token}</p>
    `;
  } catch (error) {
    message.style.color = "red";
    console.error(error);
    message.textContent = "Terjadi kesalahan server.";
    clearUserInfo()
  }
});

