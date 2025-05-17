document.addEventListener("DOMContentLoaded", function () {
    const loginFormTeacher = document.getElementById("loginFormTeacher");
    document.getElementById("loginTeacher").style.display = "flex";

    if (!loginFormTeacher) {
        console.error("❌ Formulário de login não encontrado!");
        return;
    }

    loginFormTeacher.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("emailTeacher")?.value.trim();
        const password = document.getElementById("passwordTeacher")?.value.trim();

        if (!email || !password) {
            alert("⚠️ Email e senha são obrigatórios!");
            return;
        }

        try {
            console.log("🔍 Enviando request para login...");

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role: "professor" })
            });

            const data = await response.json();
            console.log("🖥️ Resposta do servidor:", data);

            if (!response.ok) {
                throw new Error(data.message || "Erro ao fazer login!");
            }

            if (data.token && data.id) {
                console.log("✅ Login bem-sucedido! Redirecionando...");
                localStorage.setItem("token", data.token);
                localStorage.setItem("professor_id", data.id);

                setTimeout(() => {
                    window.location.href = "teacher_dashboard.html";
                }, 500);
            } else {
                alert("⚠️ Erro no login: Nenhum token ou ID retornado!");
            }
        } catch (error) {
            console.error("❌ Erro ao fazer login:", error);
            alert("Erro ao tentar fazer login. Verifique sua conexão ou tente novamente.");
        }
    });
    
    // Botão ✖ redireciona para a página inicial (index.html)
    document.querySelector(".close-button")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });

});
