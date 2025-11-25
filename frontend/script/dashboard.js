
const ul = document.getElementById("ul");
const input = document.getElementById("todos");
const addBtn = document.getElementById("addBtn");
const logOut = document.getElementById("logOut")
const profile = document.getElementById('profile')

const token = localStorage.getItem("token");

// jika tidak ada token, redirect
if (!token) {
  localStorage.removeItem("token")
  window.location.href = "login.html";
}

function deleteTodo(id){
  if(!confirm("Yakin ingin menghapus todo ini ? ")) return ;

  fetch(`http://localhost:5000/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(result => {
    console.log(result.message);
    loadTodos();
  })
  .catch(err => console.error(err))
}

function loadUsers (){
  fetch(`http://localhost:5000/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then( res => res.json())
  .then(users => {
    console.log(users)
    users.forEach( user => {
      console.log(user.username)
      const h2 = document.createElement('h2')

      const text = document.createElement('span')
      text.textContent = user.username
      console.log('dari text : ', text)

      h2.append(text)
      profile.append(h2)
    })
  })
  .catch(err => console.log(err ))
}

// 🔥 Fungsi ambil dan tampilkan todos
function loadTodos() {
  fetch("http://localhost:5000/todos", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(todos => {
      ul.innerHTML = "";
      console.log(`dari todos : `, todos)

      todos.forEach(todo => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = todo.todos
        
        const btn = document.createElement('button');
        btn.textContent = "Hapus"
        btn.style.marginLeft = "10px"

        btn.addEventListener("click", () => {
          deleteTodo(todo.todos_id)
          console.log(todo.todos_id)
        });

        li.appendChild(text);
        li.appendChild(btn);
        ul.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}

// 🔥 Fungsi tambah todo
addBtn.addEventListener("click", () => {
  const todos = input.value.trim();

  if (!todos) return alert("Tulis judul dulu!");

  fetch("http://localhost:5000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ todos })
  })
    .then(res => res.json())
    .then(newTodo => {
      input.value = ""; // kosongkan input
      loadTodos(); // refresh daftar todo
    })
    .catch(err => console.error(err));
});

logOut.addEventListener('click', () => {
  if(!confirm(`Yakin ingin logout ? `)) return ;
  localStorage.removeItem("token")
  window.location.href = "login.html"
})
// Jalankan pertama kali

loadUsers()
loadTodos();
