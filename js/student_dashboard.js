document.addEventListener("DOMContentLoaded", function () {
    // Inicialmente, esconde o modal
    document.getElementById("joinClassModal").style.display = "none";

    // Adiciona botão de logout dinamicamente ao header
    const header = document.querySelector(".dashboard-header");
    const logoutBtn = document.createElement("button");
    logoutBtn.classList.add("logout-btn");
    logoutBtn.textContent = "Sair";
    logoutBtn.addEventListener("click", logout);
    header.appendChild(logoutBtn);

    // Captura o formulário e adiciona o evento de submissão
    const joinClassForm = document.getElementById("joinClassForm");
    if (joinClassForm) {
        joinClassForm.addEventListener("submit", function (event) {
            event.preventDefault();
            joinClass();
        });
    }

    // Evento de clique para abrir o modal
    const joinClassBtn = document.querySelector(".join-class-btn");
    if (joinClassBtn) {
        joinClassBtn.addEventListener("click", openJoinClassModal);
    }

    // Evento de clique para fechar o modal
    const closeModalBtn = document.querySelector(".close-button");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeJoinClassModal);
    }

    // Adiciona eventos para alternar entre as abas
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });
    
    // Carrega os jogos ao abrir a página (aba inicial)
    loadGames();
    loadStats(); // Carrega as estatísticas do aluno
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

    // Carrega dados conforme a aba
    if (tabName === "games") {
        loadGames();
    } else if (tabName === "materials") {
        loadMaterials();
    } else if (tabName === "classes") {
        loadClasses();
    }
}

async function loadStats() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/classes/student/stats", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    console.log("CHAMOU loadClasses()");

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token não encontrado.");
        return;
    }

    fetch("http://localhost:3000/classes/student", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta da API:", data);

        const classList = document.getElementById("class-list");
        if (!classList) {
            console.error("Elemento #class-list não encontrado.");
            return;
        }

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
    console.log("Adicionando turma:", turma);

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
    if (!token) {
        console.error("Token não encontrado. Redirecionando...");
        window.location.href = "student_login.html";
        return;
    }

    const gameList = document.getElementById("game-list");
    const gameContainer = document.getElementById("game-container");

    if (!gameList || !gameContainer) {
        console.warn("Elementos 'game-list' ou 'game-container' não encontrados.");
        return;
    }

    gameList.innerHTML = "";
    gameContainer.innerHTML = "";
    gameContainer.style.display = "none";

    fetch("http://localhost:3000/classes/games", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        return response.json();
    })
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
                gameContainer.innerHTML = ""; // Limpa o anterior

                switch (game.id) {
                    case 1: // Phishing Detective
                        gameContainer.innerHTML = "";
                        const scriptPhishing = document.createElement('script');
                        scriptPhishing.src = 'js/phishing_detective.js';
                        scriptPhishing.onload = () => iniciarPhishingDetective();
                        document.body.appendChild(scriptPhishing);
                        break;
                    case 2: // Password Master
                            gameContainer.innerHTML = `
                            <div id="password-master" class="game-section">
                                <h2>Password Master</h2>
                                <p>Tenta criar uma password segura!</p>
                                <input type="text" id="passwordInput" placeholder="Insere a tua password" />
                                <button id="checkPasswordBtn">Verificar Password</button>
                                <p id="passwordResult"></p>
                                <p>Pontuação: <span id="passwordPoints">0</span></p>
                            </div>
                        `;
                        
                        const script = document.createElement('script');
                        script.src = 'js/password_master.js';
                        script.onload = () => iniciarPasswordMaster(); // chama a função quando o script estiver carregado
                        document.body.appendChild(script);
                
                        break;

                    default:
                        gameContainer.innerHTML = "<p>Este jogo ainda não está disponível.</p>";
                        break;
                }
            });

            gameList.appendChild(gameCard);
        });
    })
    .catch(error => {
        console.error("Erro ao carregar jogos:", error);
        gameList.innerHTML = "<p>Não foi possível carregar os jogos.</p>";
    });
}


function loadMaterials() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token não encontrado no localStorage. Faça login novamente.");
        window.location.href = "student_login.html";
        return;
    }

    const materialList = document.getElementById("material-list");
    materialList.innerHTML = ""; // Limpa o conteúdo anterior

    fetch("http://localhost:3000/classes/materials", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
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
    .catch(error => {
        console.error("Erro ao carregar materiais:", error);
        materialList.innerHTML = "<p>Não foi possível carregar os materiais. Verifique sua conexão ou o token.</p>";
    });
}

function adicionarTurmaAoFrontend(turma) {
    const classList = document.getElementById("class-list");

    const classCard = document.createElement("div");
    classCard.classList.add("class-card");

    const numeroAlunos = turma.numero_alunos !== undefined ? turma.numero_alunos : "0";
    const mediaPontuacao = turma.media_pontuacao !== undefined ? turma.media_pontuacao : "N/A";

    classCard.innerHTML = `
        <h2>${turma.nome}</h2>
        <p><strong>Código:</strong> ${turma.codigo_acesso}</p>
        <p><strong>Nº Alunos:</strong> ${numeroAlunos}</p>
        <p><strong>Média Pontuação:</strong> ${mediaPontuacao}%</p>
    `;

    classCard.addEventListener('click', () => mostrarDetalhesTurma(turma));
    classList.appendChild(classCard);
}

function mostrarDetalhesTurma(turma) {
    document.getElementById("detailClassName").textContent = turma.nome;
    document.getElementById("selectedClassCode").textContent = turma.codigo_acesso;
    document.getElementById("selectedClassStudents").textContent = turma.numero_alunos !== undefined ? turma.numero_alunos : "0";
    document.getElementById("selectedClassScore").textContent = turma.media_pontuacao !== undefined ? turma.media_pontuacao : "N/A";

    const detailsDiv = document.getElementById("classDetailsContainer");
    detailsDiv.style.display = "block";
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

    fetch("http://localhost:3000/classes/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ codigo_acesso: classCode })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            closeJoinClassModal();
            loadClasses(); // Recarrega as turmas após entrar
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
            errorMessage.textContent = "Não foi possível entrar na turma. Verifique sua conexão ou o token.";
            errorMessage.style.display = "block";
        } else {
            alert("Não foi possível entrar na turma. Verifique sua conexão ou o token.");
        }
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("aluno_id");
    window.location.href = "index.html";
}