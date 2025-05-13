document.addEventListener("DOMContentLoaded", function () {
    const registerFormStudent = document.getElementById("registerFormStudent");
    document.getElementById("registerstudent").style.display = "flex";

    if (registerFormStudent) {
        registerFormStudent.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullName = document.getElementById("fullNameStudent").value;
            const email = document.getElementById("emailStudent").value;
            const password = document.getElementById("passwordStudent").value;
            const confirmPassword = document.getElementById("confirmPasswordStudent").value;
            const role = "aluno"; // Define a role fixa

            // Validação de campos obrigatórios
            if (!fullName || !email || !password || !confirmPassword) {
                alert("Todos os campos são obrigatórios!");
                return;
            }

            // Validação de email
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const emailError = document.getElementById("emailError");

            if (emailError) {
                emailError.style.display = "none";
            }

            if (!emailPattern.test(email)) {
                if (emailError) emailError.style.display = "block";
                alert("Email inválido!");
                return;
            }

            // Verificar se as senhas coincidem
            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
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

                // Redireciona para a página de login do aluno
                window.location.href = "student_login.html";
            } catch (error) {
                console.error("Erro:", error);
                alert(error.message);
            }
        });
    } else {
        console.error("Erro: Formulário de registo do aluno não encontrado!");
    }
});
