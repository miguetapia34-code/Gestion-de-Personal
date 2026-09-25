import { CONFIG } from "config.js";
import { MENUS } from "roles.js";

const menu = document.querySelector("#menu");
const content = document.querySelector("#content");
const pageTitle = document.querySelector("#pageTitle");
const logoutButton = document.querySelector(
  "#logoutButton"
);

function obtenerUsuario() {
  const datos = sessionStorage.getItem(
    CONFIG.USER_SESSION_KEY
  );

  if (!datos) {
    return null;
  }

  try {
    return JSON.parse(datos);
  } catch {
    return null;
  }
}

async function cargarVista(item) {
  pageTitle.textContent = item.label;

  const respuesta = await fetch(
    `./views/${item.view}.html`
  );

  if (!respuesta.ok) {
    content.innerHTML =
      "<p>No se pudo cargar la vista.</p>";
    return;
  }

  content.innerHTML =
    await respuesta.text();

  document
    .querySelectorAll(".menu-item")
    .forEach(boton => {
      boton.classList.toggle(
        "active",
        boton.dataset.id === item.id
      );
    });
}

function construirMenu(rol) {
  const opciones = MENUS[rol] || [];

  menu.innerHTML = "";

  if (opciones.length === 0) {
    content.innerHTML =
      "<p>El usuario no tiene vistas asignadas.</p>";
    return;
  }

  opciones.forEach(item => {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "menu-item";
    boton.dataset.id = item.id;
    boton.textContent = item.label;

    boton.addEventListener("click", () => {
      cargarVista(item);
    });

    menu.appendChild(boton);
  });

  cargarVista(opciones[0]);
}

function iniciarAplicacion() {
  const usuario = obtenerUsuario();

  if (!usuario) {
    window.location.href = "index.html";
    return;
  }

  document.querySelector("#userName").textContent =
    usuario.nombre || "";

  document.querySelector("#userCode").textContent =
    usuario.codigo || "";

  document.querySelector("#roleLabel").textContent =
    usuario.rol || "";

  construirMenu(usuario.rol);
}

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(
    CONFIG.USER_SESSION_KEY
  );

  window.location.href = "index.html";
});

iniciarAplicacion();
