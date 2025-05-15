
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
        case "intermedio":
            return { label: "Intermedio", classe: "intermedio" };
        case "avancado":
        case "avançado":
            return { label: "Avançado", classe: "avancado" };
        default:
            return { label: nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase(), classe: "" };
    }
}
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
    else if (tabName === "materials") loadMaterials();
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
            const nivelFormatado = formatarNivel(game.nivel);
            const card = document.createElement("div");
            const { label, classe } = formatarNivel(game.nivel);
            card.innerHTML = `
                <h2>${game.titulo}</h2>
                <span class="level ${classe}">${label}</span>
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


