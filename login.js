import { CONFIG } from "config.js";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");
const button = document.querySelector("#loginButton");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

console.log("login.js cargado correctamente");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Ocultar";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Ver";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "";

  const codigo = form.codigo.value
    .trim()
    .toUpperCase();

  const password = form.password.value;

  if (!codigo || !password) {
    message.textContent = "Ingrese su código y contraseña";
    return;
  }

  button.disabled = true;
  button.textContent = "Validando...";

  console.log("Enviando solicitud a Power Automate");

  try {
    const respuesta = await fetch(CONFIG.LOGIN_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        codigo: codigo,
        password: password
      })
    });

    console.log("Estado de respuesta:", respuesta.status);

    const textoRespuesta = await respuesta.text();

    console.log(
      "Respuesta recibida de Power Automate:",
      textoRespuesta
    );

    let resultado;

    try {
      resultado = JSON.parse(textoRespuesta);
    } catch {
      throw new Error(
        "Power Automate no devolvió un JSON válido"
      );
    }

    if (
      !respuesta.ok ||
      resultado.autenticado !== true ||
      !resultado.usuario
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

    const rolesPermitidos = [
      "ADMINISTRADOR",
      "DISTRIBUIDOR",
      "COORDINADOR"
    ];

    if (!rolesPermitidos.includes(usuario.rol)) {
      throw new Error(
        "El usuario no tiene un rol válido"
      );
    }

    sessionStorage.setItem(
      CONFIG.USER_SESSION_KEY,
      JSON.stringify(usuario)
    );

    console.log("Usuario autenticado:", usuario);

    window.location.href = "app.html";

  } catch (error) {
    console.error(
      "Error de inicio de sesión:",
      error
    );

    message.textContent =
      error.message ||
      "No se pudo iniciar sesión";

  } finally {
    button.disabled = false;
    button.textContent = "Ingresar";
  }
});
