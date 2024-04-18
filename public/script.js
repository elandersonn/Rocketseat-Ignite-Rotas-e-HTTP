document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const forgotPasswordForm = document.getElementById("forgot-password-form");

  loginForm.addEventListener("submit", handleLogin);
  forgotPasswordForm.addEventListener("submit", handleForgotPassword);

  async function handleLogin(event) {
    event.preventDefault();

    const captchaInput = document.getElementById("captcha").value;
    const captchaText = document.getElementById("captcha-text").textContent;
    const captchaCheck = await checkCaptcha(captchaInput, captchaText);
    if (!captchaCheck) {
      return;
    }

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const validationResult = validatePassword(password);
    if (!validationResult) {
      return;
    }

    const userData = {
      username: username,
      password: password,
    };

    fetch("http://localhost:3333/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        alert("Usuário e senha válidos. Cadastrados corretamente!");
        document.getElementById("password").value = "";
        document.getElementById("username").value = "";
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById("recovery-email").value;
    const emailIsValid = await validateEmail(email)
    if (!emailIsValid) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    fetch("http://localhost:3333/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then(response => response.json())
      .then(data => {
        alert("Email enviado com sucesso. Verifique sua caixa de entrada.");
        document.getElementById("recovery-email").value = "";  // Clear the email field
      })
      .catch(error => {
        console.error("Falha ao enviar e-mail:", error);
      });
  }

  async function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});

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

function generateNewCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let captchaText = "";
  for (let i = 0; i < 5; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captcha-text").textContent = captchaText;
  document.getElementById("captcha").value = "";
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
  if (!serverResponse.valid) {
    alert("Código CAPTCHA incorreto. Tente novamente.");
    generateNewCaptcha();
    return false;
  }
  document.getElementById("captcha").value = "";
  generateNewCaptcha();
  return true;
}
