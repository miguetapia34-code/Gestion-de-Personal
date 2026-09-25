import { CONFIG } from "./config.js";
import { apiFetch } from "./api.js";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");
const button = document.querySelector("#loginButton");
const password = document.querySelector("#password");

document.querySelector("#togglePassword").addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  if (!form.reportValidity()) return;
  button.disabled = true;
  button.textContent = "Validando...";
  try {
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        codigo: form.codigo.value.trim().toUpperCase(),
        password: form.password.value
      })
    });
    sessionStorage.setItem(CONFIG.TOKEN_KEY, result.token);
    location.href = "./app.html";
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = "Ingresar";
  }
});