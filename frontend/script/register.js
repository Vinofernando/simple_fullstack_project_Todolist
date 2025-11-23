const form = document.getElementById("registerForm");
const message = document.getElementById("message");
const userInfo = document.getElementById("userInfo");

// function clearUserInfo() {
//   userInfo.innerHTML = `
//     <h3></h3>
//     <p></p>
//     <p></p>
//   `;
//   localStorage.removeItem("token");
// }

form.addEventListener('submit', async(e) => {
    e.preventDefault()

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

     if (!email || !password || !username) {
        message.textContent = "Username, Email dan password harus diisi!";
        return;
    }

    message.textContent = "Loading..."

    try{
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json()
        console.log("Data dari backend", data)

        if(!response.ok){
            message.style.color = "red"
            message.textContent = data.message || "Register gagal"
            // clearUserInfo()
            return
        }

        message.style.color = "green"
        message.textContent = "Email berhasil didaftar, Silahkan lihat pesan email anda untuk verifikasi"
    } catch (error){
        message.style.color = "red";
        console.error(error);
        message.textContent = "Terjadi kesalahan server.";
        clearUserInfo()
    }
})