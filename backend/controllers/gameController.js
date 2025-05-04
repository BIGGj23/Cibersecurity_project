const { PontuacaoJogo } = require("../models/associations");

exports.guardarPontuacao = async (req, res) => {
    try {
        const aluno_id = req.user.id;
        const { jogo_id, pontuacao, multiplicador } = req.body;

        if (!jogo_id || pontuacao === undefined) {
            return res.status(400).json({ message: "Dados incompletos." });
        }

        await PontuacaoJogo.create({
            aluno_id,
            jogo_id,
            pontuacao,
            multiplicador: multiplicador || 1,
        });

        res.status(200).json({ message: "Pontuação guardada com sucesso!" });

    } catch (err) {
        console.error("Erro ao guardar pontuação:", err);
        res.status(500).json({ message: "Erro ao guardar pontuação." });
    }
};
