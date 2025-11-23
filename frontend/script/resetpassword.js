const form = document.getElementById("resetForm");
const message = document.getElementById("message");

// Ambil token dari URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (!token) {
  message.textContent = "Token tidak valid!";
  message.style.color = "red";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const password = document.getElementById("password").value.trim();

  if (!password) {
    message.textContent = "Password harus diisi!";
    return;
  }

  message.textContent = "Loading...";

  try {
    const response = await fetch("http://localhost:5000/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await response.json();
    console.log("📦 Data dari backend:", data);

    if (!response.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Gagal mengubah password!";
      return;
    }

    message.style.color = "green";
    message.textContent = "Berhasil mengubah password! Silakan login.";
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Terjadi kesalahan server.";
  }
});
