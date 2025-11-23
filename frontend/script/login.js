const form = document.getElementById("loginForm");
const message = document.getElementById("message");

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
      return;
    }

    // Simpan token di localStorage
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    message.style.color = "red";
    console.error(error);
    message.textContent = "Terjadi kesalahan server.";
  }
});

