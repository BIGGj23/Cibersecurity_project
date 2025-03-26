function showTab(tabId) {
    const tabContents = document.querySelectorAll(".tab-content");
    const tabButtons = document.querySelectorAll(".tab-button");

    tabContents.forEach(tab => tab.style.display = "none");
    tabButtons.forEach(btn => btn.classList.remove("active"));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = "block";
        const activeButton = Array.from(tabButtons).find(btn => btn.getAttribute("onclick")?.includes(tabId));
        if (activeButton) activeButton.classList.add("active");
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    // Verifica se o professor está autenticado
    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "teacher_login.html";
        return;
    }

    // Carrega inicialmente as turmas
    await loadClasses();

    // Eventos do modal de criar turma
    const modal = document.getElementById("createClassModal");
    const openBtn = document.querySelector(".create-class-btn");
    const closeBtn = document.getElementById("closeModal");

    if (modal && openBtn && closeBtn) {
        modal.style.display = "none";

        openBtn.addEventListener("click", () => {
            modal.style.display = "block";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // SUBMISSÃO do formulário de criação de turma
    const createClassForm = document.getElementById("createClassForm");
    if (createClassForm) {
        createClassForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("className").value;

            if (!nome) {
                alert("⚠️ Nome da turma é obrigatório!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/classes/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ nome })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message || "✅ Turma criada com sucesso!");
                    modal.style.display = "none";
                    createClassForm.reset();
                    loadClasses(); // Atualiza lista
                } else {
                    alert(data.message || 'Erro ao criar turma.');
                }
            } catch (error) {
                console.error("Erro ao criar turma:", error);
                alert("Erro inesperado ao criar turma.");
            }
        });
    }

    // Função para carregar as turmas do professor
    async function loadClasses() {
        try {
            const response = await fetch("http://localhost:3000/classes/professor", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            const classList = document.getElementById("class-list");

            if (!classList) {
                console.error("❌ Elemento 'class-list' não encontrado no DOM.");
                return;
            }

            classList.innerHTML = "";

            if (response.ok && data.turmas && data.turmas.length > 0) {
                data.turmas.forEach(turma => {
                    const turmaDiv = document.createElement("div");
                    turmaDiv.classList.add("turma-item");
                    turmaDiv.innerHTML = `
                        <h3>${turma.nome}</h3>
                        <p><strong>Código de Acesso:</strong> ${turma.codigo_acesso}</p>
                    `;
                    classList.appendChild(turmaDiv);
                });
            } else {
                classList.innerHTML = "<p>Ainda não criaste nenhuma turma.</p>";
            }
        } catch (error) {
            console.error("Erro ao carregar turmas:", error);
            alert("Erro ao carregar turmas, tenta novamente mais tarde.");
        }
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("professor_id");
            window.location.href = "teacher_login.html";
        });
    }
});
