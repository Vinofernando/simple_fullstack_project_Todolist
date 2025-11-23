const form = document.getElementById("forgotForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  // validasi sederhana
  if (!email) {
    message.textContent = "Email harus diisi!";
    return;
  }

  message.textContent = "Loading...";

  try {
    const response = await fetch("http://localhost:5000/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("📦 Data dari backend:", data);


    if (!response.ok) {
        message.style.color = "red"
        message.textContent = data.message || "Gagal mengubah password!";
      return;
    }

    message.style.color = "green";
    message.textContent = "Link reset password telah dikirim ke email.";

  } catch (error) {
    message.style.color = "red";
    console.error(error);
    message.textContent = "Terjadi kesalahan server.";
  }
});

