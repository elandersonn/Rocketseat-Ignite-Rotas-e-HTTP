document.addEventListener("DOMContentLoaded", async function () {
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", handleRegister);

  async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const validationPassword = validatePassword(password);
    if (validationPassword == false) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Senhas digitadas não correspondem. Ditite novamente!");
      return;
    }

    fetch("http://localhost:3333/user", {
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
        alert("Usuário e senha válidos. Cadastrados corretamente!");
        document.getElementById("new-password").value = "";
        document.getElementById("new-username").value = "";
        document.getElementById("confirm-password").value = "";
      })
      .catch((error) => {
        console.error(error);
      });
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
