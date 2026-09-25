import { CONFIG } from "config.js";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");
const button = document.querySelector("#loginButton");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Ocultar";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Ver";
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();

  message.textContent = "";

  const codigo = form.codigo.value
    .trim()
    .toUpperCase();

  const password = form.password.value;

  if (!codigo || !password) {
    message.textContent =
      "Ingrese su código y contraseña";
    return;
  }

  button.disabled = true;
  button.textContent = "Validando...";

  try {
    const respuesta = await fetch(
      CONFIG.LOGIN_FLOW_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          codigo: codigo,
          password: password
        })
      }
    );

    const resultado = await respuesta.json();

    if (
      !respuesta.ok ||
      resultado.autenticado !== true
    ) {
      throw new Error(
        resultado.mensaje ||
        "Usuario o contraseña incorrectos"
      );
    }

    const usuario = resultado.usuario;

    usuario.rol = String(usuario.rol || "")
      .trim()
      .toUpperCase();

    sessionStorage.setItem(
      CONFIG.USER_SESSION_KEY,
      JSON.stringify(usuario)
    );

    window.location.href = "app.html";

  } catch (error) {
    console.error(error);

    message.textContent =
      error.message ||
      "No se pudo iniciar sesión";

  } finally {
    button.disabled = false;
    button.textContent = "Ingresar";
    passwordInput.value = "";
  }
});
