document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const captchaInput = document.getElementById("captcha").value;
    const captchaText = document.getElementById("captcha-text").textContent;
    const captchaCheck = checkCaptcha(captchaInput, captchaText);
    if (captchaCheck == false) {
      return
    }
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const validationResult = validatePassword(password);
    if (validationResult == false) {
      return
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
      .then((response) => response.json())
      .then((data) => {
        alert("Usuário e senha válidos. Cadastrados corretamente!");
        document.getElementById("password").value = "";
        document.getElementById("username").value = "";
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

function checkCaptcha(captchaInput, captchaText) {
  fetch("http://localhost:3333/check-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ captchaInput, captchaText }),
    })
      .then((response) => response.json())
      .then((serverResponse) => {
        if (!serverResponse) {
          alert("Código CAPTCHA incorreto. Tente novamente.");
          generateNewCaptcha();
          return;
        }
        document.getElementById("captcha").value = "";
        generateNewCaptcha();
      })
      .catch((error) => {
        console.error(error);
      });
}

function validatePassword(password) {
  if (password.length < 8) {
    alert("A senha deve conter pelo menos 8 caracteres.")
    return false
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  if (!hasUpperCase) {
    alert("A senha deve conter pelo menos uma letra maiúscula.")
    return false
  }
  if (!hasLowerCase) {
    alert("A senha deve conter pelo menos uma letra minúscula.")
    return false
  }
  if (!hasNumbers) {
    alert("A senha deve conter pelo menos um número.")
    return false
  }
  if (!hasSymbols) {
    alert("A senha deve conter pelo menos um símbolo especial.")
    return false
  }

  return true
}

function generateNewCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let captchaText = "";
  for (let i = 0; i < 5; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captcha").value = ""; 
  document.getElementById("captcha-text").textContent = captchaText;
}
