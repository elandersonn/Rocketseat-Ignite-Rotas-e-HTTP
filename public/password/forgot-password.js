document.addEventListener("DOMContentLoaded", async function () {
  const forgotPasswordForm = document.getElementById("forgot-password-form");
  forgotPasswordForm.addEventListener("submit", handleForgotPassword);

  async function handleForgotPassword(event) {
    event.preventDefault();    
    const id = document.getElementById("id").value;
    const username = document.getElementById("username").value;

    fetch("http://localhost:3333/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes('successfully')) {
          alert('Senha resetada com sucesso!')
        }
        document.getElementById("id").value = ""; 
        document.getElementById("username").value = ""; 
      })
      .catch((error) => {
        console.error("Falha ao enviar e-mail:", error);
      });
  }
});
