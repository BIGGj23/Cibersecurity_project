document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("joinClassModal").style.display = "none";

    const header = document.querySelector(".dashboard-header");
    const logoutBtn = document.createElement("button");
    logoutBtn.classList.add("logout-btn");
    logoutBtn.textContent = "Sair";
    logoutBtn.addEventListener("click", logout);
    header.appendChild(logoutBtn);

    const joinClassForm = document.getElementById("joinClassForm");
    if (joinClassForm) {
        joinClassForm.addEventListener("submit", function (event) {
            event.preventDefault();
            joinClass();
        });
    }

    const joinClassBtn = document.querySelector(".join-class-btn");
    if (joinClassBtn) {
        joinClassBtn.addEventListener("click", openJoinClassModal);
    }

    const closeModalBtn = document.querySelector(".close-button");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeJoinClassModal);
    }

    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });

    loadGames();
    loadStats();
});

function openJoinClassModal() {
    document.getElementById("joinClassModal").style.display = "block";
    document.querySelector(".modal-overlay").style.display = "block";
    document.getElementById("classCode").value = "";
}

function closeJoinClassModal() {
    document.getElementById("joinClassModal").style.display = "none";
    document.querySelector(".modal-overlay").style.display = "none";
}

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
    else if (tabName === "materials") loadMaterials();
    else if (tabName === "classes") loadClasses();
}

async function loadStats() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/classes/student/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.streak !== undefined && data.points !== undefined) {
            document.querySelector(".streak").textContent = `Streak: ${data.streak} 🔥`;
            document.querySelector(".points").textContent = `Points: ${data.points} ⭐`;
        }
    } catch (err) {
        console.error("❌ Erro ao carregar estatísticas:", err);
    }
}

function loadClasses() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE_URL}/classes/student`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const classList = document.getElementById("class-list");
        if (!classList) return;

        classList.innerHTML = "";

        if (!data.turmas || data.turmas.length === 0) {
            classList.innerHTML = "<p>Você ainda não está em nenhuma turma.</p>";
            return;
        }

        data.turmas.forEach(turma => adicionarTurmaAoFrontend(turma));
    })
    .catch(error => {
        console.error("Erro ao buscar turmas:", error);
    });
}

function adicionarTurmaAoFrontend(turma) {
    const turmaCard = document.createElement("div");
    turmaCard.classList.add("turma-card");

    turmaCard.innerHTML = `
        <h3>${turma.nome}</h3>
        <p>Código de Acesso: ${turma.codigo_acesso}</p>
    `;

    const classList = document.getElementById("class-list");
    if (classList) classList.appendChild(turmaCard);
}

function loadGames() {
    const token = localStorage.getItem("token");
    if (!token) return;

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
        const games = data.jogos;

        if (!Array.isArray(games) || games.length === 0) {
            gameList.innerHTML = "<p>Nenhum jogo disponível.</p>";
            return;
        }

        games.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");
            gameCard.innerHTML = `
                <h2>${game.titulo || "Jogo Sem Nome"}</h2>
                <span class="level ${game.nivel || 'beginner'}">${game.nivel || 'beginner'}</span>
                <p>${game.descricao || "Descrição não disponível"}</p>
                <p class="points">Points: ${game.pontos || 0}</p>
                <button class="start-btn" data-game-id="${game.id}">Start Game</button>
            `;

            gameCard.querySelector(".start-btn").addEventListener("click", () => {
                gameList.parentElement.style.display = "none";
                gameContainer.style.display = "block";
                gameContainer.innerHTML = "";

                switch (game.id) {
                    case 1:
                        const script1 = document.createElement("script");
                        script1.src = "js/phishing_detective.js";
                        script1.onload = () => iniciarPhishingDetective();
                        document.body.appendChild(script1);
                        break;

                    case 2:
                        const script2 = document.createElement("script");
                        script2.src = "js/password_master.js";
                        script2.onload = () => iniciarPasswordMaster();
                        document.body.appendChild(script2);
                        break;

                    case 3:
                        const script3 = document.createElement("script");
                        script3.src = "js/malware_hunter.js";
                        script3.onload = () => iniciarMalwareHunter();
                        document.body.appendChild(script3);
                        break;

                    default:
                        gameContainer.innerHTML = "<p>Este jogo ainda não está disponível.</p>";
                        break;
                }
            });

            gameList.appendChild(gameCard);
        });
    })
    .catch(err => {
        console.error("Erro ao carregar jogos:", err);
        gameList.innerHTML = "<p>Não foi possível carregar os jogos.</p>";
    });
}

function loadMaterials() {
    const token = localStorage.getItem("token");
    const materialList = document.getElementById("material-list");
    if (!materialList) return;

    materialList.innerHTML = "";

    fetch(`${API_BASE_URL}/classes/materials`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(materials => {
        if (!Array.isArray(materials) || materials.length === 0) {
            materialList.innerHTML = "<p>Nenhum material disponível.</p>";
        } else {
            materials.forEach(material => {
                const materialCard = document.createElement("div");
                materialCard.classList.add("class-card");
                materialCard.innerHTML = `
                    <h2>${material.title || "Material Sem Título"}</h2>
                    <p><strong>Nível:</strong> ${material.level || "N/A"}</p>
                    <p>${material.description || "Descrição não disponível"}</p>
                `;
                materialList.appendChild(materialCard);
            });
        }
    })
    .catch(err => {
        console.error("Erro ao carregar materiais:", err);
        materialList.innerHTML = "<p>Erro ao carregar materiais.</p>";
    });
}

function joinClass() {
    const classCode = document.getElementById("classCode").value;
    const token = localStorage.getItem("token");

    if (!classCode || !token) {
        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.textContent = "Código da turma e token são obrigatórios!";
            errorMessage.style.display = "block";
        } else {
            alert("Código da turma e token são obrigatórios!");
        }
        return;
    }

    fetch(`${API_BASE_URL}/classes/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ codigo_acesso: classCode })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            closeJoinClassModal();
            loadClasses();
        } else {
            const errorMessage = document.getElementById("errorMessage");
            if (errorMessage) {
                errorMessage.textContent = data.message || "Erro ao entrar na turma!";
                errorMessage.style.display = "block";
            } else {
                alert(data.message || "Erro ao entrar na turma!");
            }
        }
    })
    .catch(error => {
        console.error("Erro ao entrar na turma:", error);
        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.textContent = "Não foi possível entrar na turma.";
            errorMessage.style.display = "block";
        } else {
            alert("Não foi possível entrar na turma.");
        }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
