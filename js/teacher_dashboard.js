document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    localStorage.setItem("tipo", "professor");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "teacher_login.html";
        return;
    }

    await loadClasses();

    const modal = document.getElementById("createClassModal");
    const openBtn = document.querySelector(".create-class-btn");
    const closeBtn = document.querySelector(".close-button");

    if (modal && openBtn && closeBtn) {
        modal.style.display = "none";

        openBtn.addEventListener("click", () => modal.style.display = "block");
        closeBtn.addEventListener("click", () => modal.style.display = "none");

        window.addEventListener("click", (event) => {
            if (event.target === modal) modal.style.display = "none";
        });
    }

    const createClassForm = document.getElementById("createClassForm");
    if (createClassForm) {
        createClassForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("className").value;
            if (!nome) return alert("⚠️ Nome da turma é obrigatório!");

            try {
                const response = await fetch(`${API_BASE_URL}/classes/create`, {
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
                    loadClasses();
                } else {
                    alert(data.message || 'Erro ao criar turma.');
                }
            } catch (error) {
                console.error("Erro ao criar turma:", error);
                alert("Erro inesperado ao criar turma.");
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.clear();
            window.location.href = "teacher_login.html";
        });
    }

    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });
});

function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    const tabContent = document.getElementById(tabName);
    if (tabContent) tabContent.style.display = "block";

    const tabButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (tabButton) tabButton.classList.add("active");

    if (tabName === "games") loadGames();
    else if (tabName === "classes") loadClasses();
}

async function loadClasses() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/classes/professor`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        const classList = document.getElementById("class-list");

        if (!classList) return;

        classList.innerHTML = "";
        classList.classList.add("class-grid");

        if (data.turmas && data.turmas.length > 0) {
            data.turmas.forEach(turma => {
                const card = document.createElement("div");
                card.classList.add("class-card");
                card.innerHTML = `
                    <h3>${turma.nome}</h3>
                    <p><strong>Código da Turma:</strong> ${turma.codigo_acesso}</p>
                    <p><strong>Nº Alunos:</strong> ${turma.numero_alunos ?? 0}</p>
                    <p><strong>Pontuação média:</strong> ${turma.media_pontuacao ?? 0}%</p>
                `;
                classList.appendChild(card);
            });
        } else {
            classList.innerHTML = "<p>Ainda não criaste nenhuma turma.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        alert("Erro ao carregar turmas, tenta novamente mais tarde.");
    }
}

function loadGames() {
    const token = localStorage.getItem("token");
    const gameList = document.getElementById("game-list");
    const gameContainer = document.getElementById("game-container");

    if (!gameList || !gameContainer) return;

    gameList.innerHTML = "";
    gameContainer.innerHTML = "";
    gameContainer.style.display = "none";

    fetch(`${API_BASE_URL}/classes/games`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        data.jogos.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");
            card.innerHTML = `
                <h2>${game.titulo}</h2>
                <span class="level ${game.nivel}">${game.nivel}</span>
                <p>${game.descricao}</p>
                <button class="start-btn" data-id="${game.id}">Start Game</button>
            `;

            card.querySelector(".start-btn").addEventListener("click", () => {
                gameList.style.display = "none";
                gameContainer.style.display = "block";
                gameContainer.innerHTML = "";

                switch (game.id) {
                    case 1:
                        const script1 = document.createElement("script");
                        script1.src = "js/phishing_detective.js";
                        script1.onload = () => iniciarPhishingDetective(true);
                        document.body.appendChild(script1);
                        break;

                    case 2:
                        const script2 = document.createElement("script");
                        script2.src = "js/password_master.js";
                        script2.onload = () => iniciarPasswordMaster(true);
                        document.body.appendChild(script2);
                        break;

                    case 3:
                        const script3 = document.createElement("script");
                        script3.src = "js/malware_hunter.js";
                        script3.onload = () => iniciarMalwareHunter(true);
                        document.body.appendChild(script3);
                        break;

                    default:
                        gameContainer.innerHTML = "<p>Jogo ainda não disponível.</p>";
                }
            });

            gameList.appendChild(card);
        });
    });
}
