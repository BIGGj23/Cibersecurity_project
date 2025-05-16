
function formatarNivel(nivel) {
    if (!nivel || typeof nivel !== "string") {
        return { label: "Nível não definido", classe: "" };
    }

    const normalizado = nivel.trim().toLowerCase();

    switch (normalizado) {
        case "beginner":
        case "iniciante":
            return { label: "Iniciante", classe: "iniciante" };
        case "intermedio":
        case "intermédio":
            return { label: "Intermedio", classe: "intermedio" };
        case "avancado":
        case "avançado":
            return { label: "Avançado", classe: "avancado" };
        default:
            return { label: nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase(), classe: "" };
    }
}

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

    // Carregar dados iniciais
    loadGames();
    loadStats();
    loadClasses();
});

function openJoinClassModal() {
    document.getElementById("joinClassModal").style.display = "block";
    document.querySelector(".modal-overlay").style.display = "block";
    document.getElementById("classCode").value = "";
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }
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
    if (!token) {
        console.error("Token não encontrado no localStorage.");
        const classList = document.getElementById("class-list");
        if (classList) {
            classList.innerHTML = "<p>Você precisa estar logado para ver suas turmas.</p>";
        }
        return;
    }

    const classList = document.getElementById("class-list");
    if (!classList) {
        console.error("Elemento #class-list não encontrado no DOM.");
        return;
    }

    classList.innerHTML = "<p>Carregando turmas...</p>"; // Feedback de carregamento

    fetch(`${API_BASE_URL}/classes/student`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        console.log("Resposta da API /classes/student:", data); // Log para depuração
        classList.innerHTML = ""; // Limpar mensagem de carregamento

        if (!data.turmas || data.turmas.length === 0) {
            classList.innerHTML = "<p>Você ainda não está em nenhuma turma. Use o botão 'Entrar numa Turma' para se juntar a uma!</p>";
            return;
        }

        data.turmas.forEach(turma => adicionarTurmaAoFrontend(turma));
    })
    .catch(error => {
        console.error("Erro ao buscar turmas:", error);
        classList.innerHTML = "<p>Erro ao carregar turmas. Verifique sua conexão e tente novamente.</p>";
    });
}

function adicionarTurmaAoFrontend(turma) {
    const turmaCard = document.createElement("div");
    turmaCard.classList.add("class-card"); // Garantir que usa a classe .class-card

    turmaCard.innerHTML = `
        <h3>${turma.nome}</h3>
        <p><strong>Código da Turma:</strong> ${turma.codigo_acesso}</p>
        <p><strong>Nº Alunos:</strong> ${turma.numero_alunos ?? 0}</p>
        <p><strong>Pontuação média:</strong> ${turma.media_pontuacao ?? 0}%</p>
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

    gameList.innerHTML = "<p>Carregando jogos...</p>"; // Feedback de carregamento
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

        gameList.innerHTML = ""; // Limpar mensagem de carregamento
        games.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");
            const { label, classe } = formatarNivel(game.nivel);

            gameCard.innerHTML = `
                <h2>${game.titulo || "Jogo Sem Nome"}</h2>
                <span class="level ${classe}">${label}</span>
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

    materialList.innerHTML = "<p>Carregando materiais...</p>"; // Feedback de carregamento

    fetch(`${API_BASE_URL}/classes/materials`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(materials => {
        materialList.innerHTML = ""; // Limpar mensagem de carregamento
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

// Função para entrar na turma
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

// Função para iniciar o material
function loadMaterials() {
    const materialList = document.getElementById("material-list");
    const materialContainer = document.getElementById("material-container");
  
    if (!materialList || !materialContainer) return;
  
    materialList.innerHTML = "";
    materialContainer.style.display = "none";
    materialList.style.display = "grid";
  
    const cards = [
      {
        id: "password",
        titulo: "Como criar uma password segura?",
        nivel: "Iniciante",
        categoria: "Autenticação",
        descricao: "Aprende como criar uma password/senha segura."
      },
      {
        id: "phishing",
        titulo: "Como detetar um phishing?",
        nivel: "Iniciante",
        categoria: "Engenharia Social",
        descricao: "Aprende a reconhecer e evitar ataques de phishing."
      },
      {
        id: "malware",
        titulo: "Como descobrir infecção um malware?",
        nivel: "Intermediário",
        categoria: "Segurança de Sistemas",
        descricao: "Identifica sintomas e prevenção de infeções por malware."
      }
    ];
  
    cards.forEach(mat => {
      const card = document.createElement("div");
      card.classList.add("class-card");
      card.innerHTML = `
        <h2>${mat.titulo}</h2>
        <p class="material-nivel">${mat.nivel}</p>
        <p><strong>${mat.categoria}</strong></p>
        <p>${mat.descricao}</p>
        <button class="btn-aprender" onclick="iniciarMaterial('${mat.id}')">Vamos Aprender!</button>
      `;
      materialList.appendChild(card);
    });
  }
  

  const materiais ={
    password: {
        titulo: "Como criar uma password segura?",
        conteudo: `
          <h3>Como criar uma palavra-passe segura?</h3>
          <p>Palavras-passes fortes são sua primeira linha de defesa.</p>
          <ul>
            <li>Use pelo menos 8 caracteres</li>
            <li>Combine letras maiúsculas/minúsculas, números e caracteres especiais (ex: Seguro/*123)</li>
            <li>Nunca compartilhe suas senhas com ninguém</li>
            <li>Evite usar a mesma senha para diferentes contas</li>
            <li>Use autenticação de dois fatores (2FA) quando disponível</li>
          </ul>
          <p><strong>Exemplo:</strong> 'Senha123' é fraca, enquanto 'A1/b2C*3d4' é melhor. <strong>NUNCA</strong> use seu nome ou data de nascimento.</p>
          <p>Em caso de dúvida, use um gerador de palavras-passes. Para contas seguras, sempre prefira palavras-passes únicas e complexas.</p>
        `
    },

    phishing: {
        titulo: "Como detetar um phishing?",
        conteudo: `
          <h3>Conscientização sobre Phishing</h3>
          <p>Como identificar tentativas de phishing:</p>
          <ul>
            <li>Sempre verifique o endereço de e-mail completo do remetente (suspeito? Não confie!)</li>
            <li>Fique atento a domínios com erros ortográficos (ex: amazzon.com, microsoflt.com)</li>
            <li>Não clique em links ou anexos suspeitos</li>
            <li>Empresas legítimas entrarão em contato com você usando seus canais oficiais</li>
            <li>Nunca forneça informações sensíveis quando solicitado inesperadamente</li>
          </ul>
        `
    },

    malware: {
        titulo: "Como descobrir um malware?",
        conteudo: `
    <h3>Prevenção de Malware</h3>
    <p>Malware é software malicioso criado para causar dano, roubar dados ou pedir resgate. Conheça a teoria para responder ao jogo 'Malware Hunter':</p>
    
    <h4>Tipos de malware e conceitos importantes:</h4>
    <ul>
      <li><strong>Vírus/Spyware/Keylogger/Trojan:</strong> Programas que entram disfarçados ou se instalam sem você perceber. Keyloggers registram tudo que você digita!</li>
      <li><strong>Ransomware:</strong> Sequestro digital. Criptografa seus arquivos e pede pagamento (nunca pague — prefira restaurar backup).</li>
      <li><strong>Cryptojacker:</strong> Usa seu computador para minerar criptomoedas em segredo, sem pedir permissão.</li>
      <li><strong>PUP (Potentially Unwanted Program):</strong> Softwares não necessariamente maliciosos, mas que mostram anúncios ou coletam dados indesejados.</li>
      <li><strong>Phishing:</strong> E-mails falsos tentando roubar seus dados ou instalar malware — sempre verifique remetente e links!</li>
    </ul>

    <h4>Como o malware entra no sistema?</h4>
    <ul>
      <li><strong>Abrindo anexos suspeitos de e-mails</strong> (ex: invoice.exe)</li>
      <li><strong>Baixando ou executando arquivos desconhecidos</strong></li>
      <li><strong>Clicando em links sem verificar a autenticidade</strong></li>
      <li><strong>Usando software pirata/crackeado</strong></li>
    </ul>

    <h4>Como se proteger e boas práticas:</h4>
    <ul>
      <li>Nunca abra anexos .exe ou arquivos suspeitos por e-mail</li>
      <li><strong>Atualize sempre</strong> o sistema e apps contra falhas exploradas por malware</li>
      <li>Faça backup regular dos seus arquivos importantes</li>
      <li>Mantenha o antivírus ativo e atualizado</li>
      <li>Use uma firewall ativa para bloquear acessos não autorizados</li>
      <li><strong>Ao suspeitar de infecção:</strong> Desconecte da Internet rapidamente</li>
    </ul>

    <h4>O que fazer em situações comuns:</h4>
    <ul>
      <li>Recebeu e-mail estranho com .exe? <strong>Excluir sem abrir!</strong></li>
      <li>Baixou arquivo suspeito? <strong>Excluir imediatamente e rodar o antivírus</strong></li>
      <li>PC lento com programas estranhos? <strong>Pode ser infecção por malware</strong></li>
      <li>Antivírus alertou sobre PUP? Leia com atenção: nem sempre é perigoso</li>
      <li>Exemplo de malware: <strong>Trojan disfarçado de app legítimo</strong></li>
      <li>O que ransomware faz? <strong>Criptografa arquivos e pede pagamento</strong></li>
      <li>Recebeu phishing? <strong>Nunca informe dados pessoais</strong></li>
      <li>Suspeita de infecção? <strong>Primeiro passo: desconectar da rede/Internet</strong></li>
    </ul>

    <h4>Conceitos úteis:</h4>
    <ul>
      <li><strong>Sandbox:</strong> usado por analistas para isolar e analisar malware</li>
      <li><strong>Polimorfismo:</strong> vírus que mudam seu código para evitar detecção</li>
      <li><strong>Cryptojacker:</strong> malware de mineração instalado sem consentimento</li>
    </ul>

    <p><strong>Em resumo:</strong> mantenha tudo atualizado, desconfie sempre, evite abrir arquivos e links desconhecidos, tenha backups — e nunca pague resgate!</p>
  `
}

  };

  // Função para iniciar o material
  function iniciarMaterial(id) {
    const material = materiais[id];
    const materialList = document.getElementById("material-list");
    const materialContainer = document.getElementById("material-container");
  
    if (!material || !materialList || !materialContainer) return;
  
    materialList.style.display = "none";
    materialContainer.style.display = "block";
  
    materialContainer.innerHTML = `
      <button class="btn-voltar" onclick="voltarParaLista()">⬅ Voltar</button>
      <h2>${material.titulo}</h2>
      <div class="material-scroll">${material.conteudo}</div>
    `;
}


window.iniciarMaterial = iniciarMaterial;

  // Função para voltar à lista de materiais
  function voltarParaLista() {
    document.getElementById("material-container").style.display = "none";
    document.getElementById("material-list").style.display = "grid";
  }
  
  window.voltarParaLista = voltarParaLista;

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
