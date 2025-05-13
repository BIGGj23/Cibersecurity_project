document.addEventListener("DOMContentLoaded", function () {
    const registerFormTeacher = document.getElementById("registerFormTeacher");
    document.getElementById("registerTeacher").style.display = "flex";

    if (registerFormTeacher) {
        registerFormTeacher.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullName = document.getElementById("fullNameTeacher").value;
            const email = document.getElementById("emailTeacher").value;
            const password = document.getElementById("passwordTeacher").value;
            const confirmPassword = document.getElementById("confirmPasswordTeacher").value;
            const role = "professor"; // Define a role fixa

            // Elemento para exibir erros
            const errorMessage = document.getElementById("errorMessage");
            if (errorMessage) errorMessage.style.display = "none"; // Limpa erros anteriores

            // Validação de campos obrigatórios
            if (!fullName || !email || !password || !confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = "Todos os campos são obrigatórios!";
                    errorMessage.style.display = "block";
                } else {
                    alert("Todos os campos são obrigatórios!");
                }
                return;
            }

            // Validação de email
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const emailError = document.getElementById("emailError");

            if (!emailPattern.test(email)) {
                if (emailError) {
                    emailError.style.display = "block";
                }
                if (errorMessage) {
                    errorMessage.textContent = "Email inválido!";
                    errorMessage.style.display = "block";
                } else {
                    alert("Email inválido!");
                }
                return;
            } else if (emailError) {
                emailError.style.display = "none";
            }

            // Validação de senha (mínimo 8 caracteres, pelo menos 1 letra e 1 número)
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordPattern.test(password)) {
                if (errorMessage) {
                    errorMessage.textContent = "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra e 1 número.";
                    errorMessage.style.display = "block";
                } else {
                    alert("A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra e 1 número.");
                }
                return;
            }

            // Verificar se as senhas coincidem
            if (password !== confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = "As senhas não coincidem!";
                    errorMessage.style.display = "block";
                } else {
                    alert("As senhas não coincidem!");
                }
                return;
            }

            try {
                // Enviar os dados para o backend
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: fullName, email, password, role })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Erro ao registrar!");
                }

                alert(data.mensagem);

                // Redireciona para a página de login do professor
                window.location.href = "teacher_login.html";
            } catch (error) {
                console.error("Erro:", error);
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                    errorMessage.style.display = "block";
                } else {
                    alert(error.message);
                }
            }
        });
    }
});
