document.addEventListener("DOMContentLoaded", function () {
    // Inicialmente, esconde o modal
    document.getElementById("createClassModal").style.display = "none";

    // Adiciona botão de logout dinamicamente ao header
    const header = document.querySelector(".dashboard-header");
    const logoutBtn = document.createElement("button");
    logoutBtn.classList.add("logout-btn");
    logoutBtn.textContent = "Sair";
    logoutBtn.addEventListener("click", logout);
    header.appendChild(logoutBtn);

    // Captura o formulário e adiciona o evento de submissão
    const createClassForm = document.getElementById("createClassForm");
    if (createClassForm) {
        createClassForm.addEventListener("submit", function (event) {
            event.preventDefault();
            createClass();
        });
    }

    // Evento de clique para abrir o modal
    const createClassBtn = document.querySelector(".create-class-btn");
    if (createClassBtn) {
        createClassBtn.addEventListener("click", openCreateClassModal);
    }

    // Adiciona eventos para alternar entre as abas
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tabName = this.getAttribute("onclick").match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });

    // Carrega as turmas ao abrir a página (aba inicial)
    loadClasses();
});

function openCreateClassModal() {
    document.getElementById("createClassModal").style.display = "block";
    document.querySelector(".modal-overlay").style.display = "block";
    document.getElementById("className").value = "";
}

function closeCreateClassModal() {
    document.getElementById("createClassModal").style.display = "none";
    document.querySelector(".modal-overlay").style.display = "none";
}

function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(tabName).style.display = "block";
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add("active");

    // Chama a função correspondente com base na aba
    if (tabName === "classes") {
        loadClasses();
    } else if (tabName === "practice-games") {
        loadPracticeGames();
    } else if (tabName === "learning-materials") {
        loadLearningMaterials();
    }
}

function loadClasses() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token não encontrado no localStorage. Faça login novamente.");
        window.location.href = "teacher_login.html";
        return;
    }

    fetch("http://localhost:3000/classes", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const classList = document.getElementById("class-list");
        classList.innerHTML = "";

        if (data && Array.isArray(data.turmas)) {
            if (data.turmas.length === 0) {
                classList.innerHTML = "<p>Nenhuma turma criada ainda.</p>";
            } else {
                data.turmas.forEach(turma => {
                    adicionarTurmaAoFrontend(turma);
                });
            }
        } else if (data && data.message) {
            console.error("Erro retornado pela API:", data.message);
            alert(data.message);
        } else {
            console.error("Os dados recebidos não contêm uma propriedade 'turmas' válida:", data);
        }
    })
    .catch(error => {
        console.error("Erro ao carregar turmas:", error);
        alert("Não foi possível carregar as turmas. Verifique sua conexão ou o token.");
    });
}

function loadPracticeGames() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token não encontrado no localStorage. Faça login novamente.");
        window.location.href = "teacher_login.html";
        return;
    }

    const classList = document.getElementById("class-list");
    classList.innerHTML = "";

    fetch("http://localhost:3000/classes/games", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(games => {
        if (!Array.isArray(games) || games.length === 0) {
            classList.innerHTML = "<p>Nenhum jogo disponível.</p>";
        } else {
            games.forEach(game => {
                const gameCard = document.createElement("div");
                gameCard.classList.add("class-card");
                gameCard.innerHTML = `
                    <h2>${game.nome || "Jogo Sem Nome"}</h2>
                    <p>${game.descricao || "Descrição não disponível"}</p>
                    <p><strong>Nível:</strong> ${game.nivel || "N/A"}</p>
                    <p><strong>Pontos:</strong> ${game.pontos || 0}</p>
                `;
                classList.appendChild(gameCard);
            });
        }
    })
    .catch(error => {
        console.error("Erro ao carregar jogos:", error);
        classList.innerHTML = "<p>Não foi possível carregar os jogos. Verifique sua conexão ou o token.</p>";
    });
}

function loadLearningMaterials() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token não encontrado no localStorage. Faça login novamente.");
        window.location.href = "teacher_login.html";
        return;
    }

    const classList = document.getElementById("class-list");
    classList.innerHTML = "";

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
            classList.innerHTML = "<p>Nenhum material disponível.</p>";
        } else {
            materials.forEach(material => {
                const materialCard = document.createElement("div");
                materialCard.classList.add("class-card");
                materialCard.innerHTML = `
                    <h2>${material.title || "Material Sem Título"}</h2>
                    <p><strong>Nível:</strong> ${material.level || "N/A"}</p>
                    <p>${material.description || "Descrição não disponível"}</p>
                `;
                classList.appendChild(materialCard);
            });
        }
    })
    .catch(error => {
        console.error("Erro ao carregar materiais:", error);
        classList.innerHTML = "<p>Não foi possível carregar os materiais. Verifique sua conexão ou o token.</p>";
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

function createClass() {
    const className = document.getElementById("className").value;
    const token = localStorage.getItem("token");

    if (!className || !token) {
        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.textContent = "Nome da turma e token são obrigatórios!";
            errorMessage.style.display = "block";
        } else {
            alert("Nome da turma e token são obrigatórios!");
        }
        return;
    }

    fetch("http://localhost:3000/classes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome: className })
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
            closeCreateClassModal();
            loadClasses();
        } else {
            const errorMessage = document.getElementById("errorMessage");
            if (errorMessage) {
                errorMessage.textContent = data.message || "Erro ao criar a turma!";
                errorMessage.style.display = "block";
            } else {
                alert(data.message || "Erro ao criar a turma!");
            }
        }
    })
    .catch(error => {
        console.error("Erro ao criar turma:", error);
        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.textContent = "Não foi possível criar a turma. Verifique sua conexão ou o token.";
            errorMessage.style.display = "block";
        } else {
            alert("Não foi possível criar a turma. Verifique sua conexão ou o token.");
        }
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("professor_id");
    window.location.href = "teacher_login.html";
}