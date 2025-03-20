document.addEventListener("DOMContentLoaded", function () {
    const loginFormTeacher = document.getElementById("loginFormTeacher");

    if (loginFormTeacher) {
        loginFormTeacher.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("emailTeacher").value;
            const password = document.getElementById("passwordTeacher").value;

            // Validação de campos obrigatórios
            if (!email || !password) {
                alert("Email e senha são obrigatórios!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role: "professor" }) // Inclui role para validação
                });

                const data = await response.json();
                console.log("Resposta do servidor:", data); // Debug

                if (!response.ok) {
                    throw new Error(data.error || "Erro ao fazer login!");
                }

                if (data.token && data.id) {
                    // ✅ Armazena o token e o ID do professor no localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("professor_id", data.id);

                    // ✅ Aguarda um pequeno tempo antes de redirecionar
                    setTimeout(() => {
                        window.location.href = "teacher_dashboard.html";
                    }, 500);
                } else {
                    alert("Erro no login: " + (data.error || "Nenhum token ou ID retornado"));
                }
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                alert("Erro ao tentar fazer login. Verifique sua conexão ou tente novamente.");
            }
        });
    }
});