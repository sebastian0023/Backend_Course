/* ===== Utilidades ===== */
function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

function initLogin() {
  document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("msg");
    msg.textContent = "";
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        msg.textContent = data.message;
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      location.href = "menu.html";
    } catch (err) {
      msg.textContent = "No se pudo conectar con el servidor";
    }
  });
}

function initRegister() {
  document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("msg");
    msg.className = "error";
    msg.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      msg.textContent = "Todos los campos son obligatorios";
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        msg.textContent = data.message;
        return;
      }
      msg.className = "ok";
      msg.textContent = "Registro exitoso, redirigiendo...";
      setTimeout(() => (location.href = "login.html"), 1000);
    } catch (err) {
      msg.textContent = "No se pudo conectar con el servidor";
    }
  });
}

function initItems() {
  const token = localStorage.getItem("token");
  const me = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !me) {
    location.href = "login.html";
    return;
  }

  let mode = "all";
  document.getElementById("who").textContent = me.name;

  async function api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (res.status === 401) {
      localStorage.clear();
      location.href = "login.html";
      throw new Error("Sesión expirada");
    }
    return { ok: res.ok, data: await res.json() };
  }

  async function loadList() {
    const msg = document.getElementById("listMsg");
    const list = document.getElementById("list");
    msg.textContent = "";
    list.innerHTML = "";

    const { ok, data } = await api(mode === "mine" ? "/api/items/mine" : "/api/items");
    if (!ok) {
      msg.textContent = data.message;
      return;
    }
    if (data.length === 0) {
      list.appendChild(el("p", "Sin registros"));
      return;
    }

    data.forEach((item) => {
      const row = el("div", undefined, "item");
      const estado = item.status === "found" ? "Pendiente de devolución" : "Devuelto";
      row.appendChild(el("strong", item.title));
      row.appendChild(el("div", "Estado: " + estado));
      row.appendChild(
        el("div", "Ubicación: " + item.location + " | Fecha: " + item.foundDate.slice(0, 10))
      );

      const detailBtn = el("button", "Ver detalle");
      detailBtn.onclick = () => showDetail(item._id);
      row.appendChild(detailBtn);

      const ownerId = item.user && item.user._id;
      if (ownerId === me.id) {
        if (item.status === "found") {
          const b = el("button", "Marcar devuelto");
          b.onclick = () => markReturned(item._id);
          row.appendChild(b);
        }
        const d = el("button", "Eliminar");
        d.onclick = () => removeItem(item._id);
        row.appendChild(d);
      }
      list.appendChild(row);
    });
  }

  async function showDetail(id) {
    const { ok, data } = await api("/api/items/" + id);
    const box = document.getElementById("detail");
    box.innerHTML = "";
    if (!ok) {
      box.appendChild(el("p", data.message, "error"));
    } else {
      box.appendChild(el("h3", data.title));
      box.appendChild(el("p", "Descripción: " + data.description));
      box.appendChild(el("p", "Ubicación: " + data.location));
      box.appendChild(el("p", "Fecha: " + data.foundDate.slice(0, 10)));
      box.appendChild(el("p", "Estado: " + data.status));
      box.appendChild(el("p", "Registrado por: " + (data.user ? data.user.name : "-")));
    }
    document.getElementById("detailBox").style.display = "block";
  }

  async function markReturned(id) {
    const { ok, data } = await api("/api/items/" + id, {
      method: "PUT",
      body: JSON.stringify({ status: "returned" }),
    });
    if (!ok) document.getElementById("listMsg").textContent = data.message;
    loadList();
  }

  async function removeItem(id) {
    if (!confirm("¿Eliminar este registro?")) return;
    const { ok, data } = await api("/api/items/" + id, { method: "DELETE" });
    if (!ok) document.getElementById("listMsg").textContent = data.message;
    loadList();
  }

  document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("createMsg");
    msg.className = "error";
    msg.textContent = "";
    const { ok, data } = await api("/api/items", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        foundDate: document.getElementById("foundDate").value,
      }),
    });
    if (!ok) {
      msg.textContent = data.message;
      return;
    }
    msg.className = "ok";
    msg.textContent = "Objeto registrado";
    e.target.reset();
    loadList();
  });

  document.getElementById("tabAll").onclick = () => { mode = "all"; loadList(); };
  document.getElementById("tabMine").onclick = () => { mode = "mine"; loadList(); };
  document.getElementById("closeDetail").onclick = () => {
    document.getElementById("detailBox").style.display = "none";
  };
  document.getElementById("logout").onclick = () => {
    localStorage.clear();
    location.href = "login.html";
  };

  loadList();
}

const pages = { login: initLogin, register: initRegister, items: initItems };
const current = document.body.dataset.page;
if (pages[current]) pages[current]();