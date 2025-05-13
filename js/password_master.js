document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");

    if (gameContainer) {
        iniciarPasswordMaster();
    }
});

function iniciarPasswordMaster() {
    const gameHTML = `
        <div class="game-section">
            <h2>Password Master</h2>
            <p>Tenta criar uma password segura!</p>
            <input type="text" id="passwordInput" placeholder="Insere a tua password" />
            <button id="checkPasswordBtn" class="jogo-btn">Verificar Password</button>
            <p id="passwordResult"></p>
            <p>Total de Pontos: <span id="passwordPoints">0</span></p>
        </div>
    `;

    document.getElementById("game-container").innerHTML = gameHTML;

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

        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            streak++;
            multiplicador = streak >= 3 ? 2 : 1;
            pontosGanhos = 100 * multiplicador;

            resultDisplay.innerHTML = `✅ <span style="color: green;">Password forte! +${pontosGanhos} pontos (x${multiplicador})</span>`;
        } else {
            streak = 0;
            pontosGanhos = 0;
            resultDisplay.innerHTML = `❌ <span style="color: red;">Password fraca! Nenhum ponto atribuído.</span>`;
        }

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

            if (typeof loadStats === "function") {
                loadStats();
            }

            atualizarPontuacaoVisual();
        } catch (error) {
            console.error("Erro ao guardar pontuação:", error);
        }

        passwordInput.value = "";
    });

    async function atualizarPontuacaoVisual() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_BASE_URL}/classes/student/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            pointDisplay.textContent = data.points || 0;
        } catch (err) {
            console.error("Erro ao buscar pontuação:", err);
        }
    }
}
