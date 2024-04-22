document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.getElementById("login-form");  
  loginForm.addEventListener("submit", handleLogin);
  document.getElementById("login-form").value = generateNewCaptcha(); 

  async function handleLogin(event) {
    event.preventDefault();

    const captchaInput = document.getElementById("captcha").value;
    const captchaText = document.getElementById("captcha-text").textContent;
    const captchaCheck = await checkCaptcha(captchaInput, captchaText);
    if (captchaCheck === false) {
      return;
    }

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          window.location.href = "../success.html";
        } else {
          alert("Erro na autenticação! Verifique o usuário e senha e tente novamente.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

})

function generateNewCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let captchaText = "";
  for (let i = 0; i < 5; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captcha-text").textContent = captchaText;
  document.getElementById("captcha").value = "";
}

function validatePassword(password) {
  if (password.length < 8) {
    alert("A senha deve conter pelo menos 8 caracteres.");
    return false;
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  if (!hasUpperCase) {
    alert("A senha deve conter pelo menos uma letra maiúscula.");
    return false;
  }
  if (!hasLowerCase) {
    alert("A senha deve conter pelo menos uma letra minúscula.");
    return false;
  }
  if (!hasNumbers) {
    alert("A senha deve conter pelo menos um número.");
    return false;
  }
  if (!hasSymbols) {
    alert("A senha deve conter pelo menos um símbolo especial.");
    return false;
  }
  return true;
}

async function checkCaptcha(captchaInput, captchaText) {
  const response = await fetch("http://localhost:3333/check-captcha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ captchaInput, captchaText }),
  });
  const serverResponse = await response.json();
  if (!serverResponse) {
    alert("Código CAPTCHA incorreto. Tente novamente.");
    generateNewCaptcha();
    return false;
  }
  document.getElementById("captcha").value = "";
  generateNewCaptcha();
  return true;
}
