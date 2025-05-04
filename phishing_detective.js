function iniciarPhishingDetective() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.display = "block";

    const perguntas = [
        {
            remetente: "security-noreply@paypal-secure.net",
            assunto: "Atividade invulgar detectada",
            corpo: "Detectámos uma atividade invulgar na sua conta. Verifique a sua identidade introduzindo os seus dados de início de sessão aqui: https://paypal-secure.net/verify",
            dica: "Verifique cuidadosamente o URL - é o domínio oficial do PayPal?",
            resposta: "Phishing"
        },
        {
            remetente: "no-reply@notifications.google.com",
            assunto: "Alerta de segurança: Novo início de sessão",
            corpo: "Foi detectado um novo início de sessão na sua Conta Google. Se for o seu caso, não é necessário efetuar qualquer ação. Caso contrário, proteja a sua conta aqui.",
            dica: "Examinar o domínio do remetente e a estrutura da mensagem.",
            resposta: "Legitimate"
        },
        {
            remetente: "support@microsoftlt.com",
            assunto: "A sua conta Microsoft foi bloqueada",
            corpo: "Detectámos atividade suspeita. A sua conta foi temporariamente bloqueada. Verifique a sua identidade para desbloquear a sua conta.",
            dica: "Observe atentamente a ortografia do nome de domínio.",
            resposta: "Phishing"
        }
    ];

    let indexAtual = 0;
    let pontuacaoTotal = 0;
    let streak = 0;

    function mostrarPergunta() {
        const p = perguntas[indexAtual];

        gameContainer.innerHTML = `
            <div class="game-section">
                <h2>Phishing Detective <span class="nivel">Intermediate</span></h2>
                <p><strong>Para:</strong> ${p.remetente}</p>
                <p><strong>Assunto:</strong> ${p.assunto}</p>
                <div class="mensagem">${p.corpo}</div>
                <p><em>Dica: ${p.dica}</em></p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="btn-phishing" class="jogo-btn">Phishing</button>
                    <button id="btn-legit" class="jogo-btn">Não é phishing</button>
                </div>
                <p id="feedback" style="margin-top: 20px;"></p>
                <p>Pontuação: <span id="pontos">${pontuacaoTotal}</span></p>
            </div>
        `;

        document.getElementById("btn-phishing").addEventListener("click", () => verificarResposta("Phishing"));
        document.getElementById("btn-legit").addEventListener("click", () => verificarResposta("Legitimate"));
    }

    function verificarResposta(respostaDada) {
        const correta = perguntas[indexAtual].resposta;
        const feedback = document.getElementById("feedback");

        if (respostaDada === correta) {
            streak++;
            const multiplicador = streak >= 3 ? 2 : 1;
            const pontos = 100 * multiplicador;
            pontuacaoTotal += pontos;

            feedback.innerHTML = `✅ Correto! +${pontos} pontos (x${multiplicador})`;
            feedback.className = "correcto";
        } else {
            feedback.innerHTML = `❌ Incorreto! A resposta certa era: ${correta}`;
            feedback.className = "incorreto";
            streak = 0;
        }

        document.getElementById("pontos").textContent = pontuacaoTotal;

        setTimeout(() => {
            indexAtual++;
            if (indexAtual < perguntas.length) {
                mostrarPergunta();
            } else {
                terminarJogo();
            }
        }, 1200);
    }

    async function terminarJogo() {
        const token = localStorage.getItem("token");
    
        try {
            await fetch("http://localhost:3000/games/score/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    pontuacao: pontuacaoTotal,
                    multiplicador: streak >= 3 ? 2 : 1,
                    jogo_id: 1
                })
            });
    
            if (typeof loadStats === "function") loadStats();
    
            // Determinar feedback com base na pontuação
            let mensagemFinal = "";
            const perguntasTotais = 3;
            const acertos = pontuacaoTotal / 100;
    
            if (acertos === 0) {
                mensagemFinal = "Tenta novamente! O phishing apanhou-te desta vez. 🕳️";
            } else if (acertos === 1) {
                mensagemFinal = "Boa tentativa! Já estás a caminho de dominar o phishing. 👀";
            } else if (acertos === 2) {
                mensagemFinal = "Quase lá! Já tens olho para detetar fraudes. 🔍";
            } else {
                mensagemFinal = "Boa! Já és um detetive do phishing 🕵️‍♂️";
            }
    
            gameContainer.innerHTML = `
                <div class="game-section">
                    <h2>Fim do Jogo!</h2>
                    <p>Pontuação Final: ${pontuacaoTotal}</p>
                    <p>Streak Final: ${streak}</p>
                    <p>${mensagemFinal}</p>
                </div>
            `;
        } catch (err) {
            console.error("Erro ao guardar pontuação:", err);
        }
    }
    

    mostrarPergunta();
}
