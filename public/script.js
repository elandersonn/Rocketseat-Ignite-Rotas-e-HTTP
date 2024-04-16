document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const validationResult = validatePassword(password);

      if (validationResult !== true) {
        alert("A senha não atende aos critérios especificados: " + validationResult);
        return;
      }

      const userData = {
          username: username,
          password: password
      };

      fetch('http://localhost:3333/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        alert('Usuário e senha válidos. Cadastrados corretamente!')
        document.getElementById('password').value = '';
        document.getElementById('username').value = '';
      })
      .catch((error) => {
          console.error(error);
      });
  });
});


function validatePassword(password) {
  if (password.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  if (!hasUpperCase) {
    return "A senha deve conter pelo menos uma letra maiúscula.";
  }
  if (!hasLowerCase) {
    return "A senha deve conter pelo menos uma letra minúscula.";
  }
  if (!hasNumbers) {
    return "A senha deve conter pelo menos um número.";
  }
  if (!hasSymbols) {
    return "A senha deve conter pelo menos um símbolo especial.";
  }

  return true;
}
