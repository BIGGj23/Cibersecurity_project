function iniciarPasswordMaster() {
    const gameHTML = `
        <div class="game-section">
            <h2>Mestre da Password</h2>
            <p>Tenta criar uma password segura!</p>
            <input type="text" id="passwordInput" placeholder="Insere a tua password" />
            <button id="checkPasswordBtn" class="jogo-btn">Verificar Password</button>
            <p id="passwordResult"></p>
            <p>Total de Pontos: <span id="passwordPoints">0</span></p>
        </div>
    `;

    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = gameHTML;

    const passwordInput = document.getElementById("passwordInput");
    const checkButton = document.getElementById("checkPasswordBtn");
    const resultDisplay = document.getElementById("passwordResult");
    const pointDisplay = document.getElementById("passwordPoints");

    let streak = 0;

    atualizarPontuacaoVisual();

    checkButton.addEventListener("click", async () => {
        const password = passwordInput.value.trim();
        if (!password) return;

        let pontosGanhos = 0;
        let multiplicador = 1;
        let mensagemFinal = "";
        let resultadoHTML = "";

        const passwordForte = password.length >= 8 &&
                              /[A-Z]/.test(password) &&
                              /[0-9]/.test(password) &&
                              /[^A-Za-z0-9]/.test(password);

        if (passwordForte) {
            streak++;
            multiplicador = streak >= 3 ? 2 : 1;
            pontosGanhos = 100 * multiplicador;
            resultadoHTML = `✅ <span style="color: green;">Password forte! +${pontosGanhos} pontos (x${multiplicador})</span>`;
            mensagemFinal = "<p style='color: #2ecc71;'>Boa! Criaste uma password segura. Continua assim! 🔐</p>";
        } else {
            streak = 0;
            pontosGanhos = 0;
            resultadoHTML = "❌ <span style='color: red;'>Password fraca! Nenhum ponto atribuído.</span>";
            mensagemFinal = "<p style='color: #e74c3c;'>Tenta novamente com uma password mais forte. 💡</p>";
        }

        resultDisplay.innerHTML = resultadoHTML;
        passwordInput.value = "";

        const token = localStorage.getItem("token");

        try {
            await fetch(`${API_BASE_URL}/games/score/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    pontuacao: pontosGanhos,
                    multiplicador,
                    jogo_id: 2
                }),
            });

            if (typeof loadStats === "function") loadStats();
            atualizarPontuacaoVisual();
        } catch (error) {
            console.error("Erro ao guardar pontuação:", error);
        }

        setTimeout(() => {
            gameContainer.innerHTML = `
                <div class="game-section">
                    <div class="game-header">
                        <h2 class="fim-jogo">Fim do Jogo!</h2>
                        <button class="btn-voltar" id="btnVoltarPM">⬅ Voltar para Jogos</button>
                    </div>
                    ${mensagemFinal}
                    <p>Pontuação obtida: <strong>${pontosGanhos}</strong></p>
                    <p>Streak final: <strong>${streak}</strong></p>
                </div>
            `;
        
            const voltarBtn = document.getElementById("btnVoltarPM");
            if (voltarBtn) {
                voltarBtn.addEventListener("click", voltarParaJogos);
            }
        }, 1500);
    });

    async function atualizarPontuacaoVisual() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_BASE_URL}/classes/student/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            pointDisplay.textContent = data.points || 0;
        } catch (err) {
            console.error("Erro ao buscar pontuação:", err);
        }
    }

    function mostrarBotaoVoltar() {
        const voltarBtn = document.createElement("button");
        voltarBtn.textContent = "⬅ Voltar para os Jogos";
        voltarBtn.classList.add("btn-voltar");
        voltarBtn.onclick = () => {
            if (typeof voltarParaJogos === "function") {
                voltarParaJogos();
            } else {
                document.getElementById("game-container").style.display = "none";
                document.getElementById("game-list").style.display = "grid";
            }
        };
        document.getElementById("game-container").appendChild(voltarBtn);
    }
}
