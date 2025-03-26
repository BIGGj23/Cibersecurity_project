const { Turma, Utilizador, Jogo, TurmaAluno } = require('../models/associations');

// Criar uma nova turma
const createClass = async (req, res) => {
    try {
        const { nome } = req.body;
        const professorId = req.user.id;

        if (!nome) {
            return res.status(400).json({ success: false, message: 'O nome da turma é obrigatório.' });
        }

        const codigoAcesso = Math.random().toString(36).substring(2, 8).toUpperCase(); // Código aleatório
        const turma = await Turma.create({ nome, professor_id: professorId, codigo_acesso: codigoAcesso });

        res.status(201).json({ success: true, message: 'Turma criada com sucesso!', turma });
    } catch (error) {
        console.error('❌ Erro ao criar turma:', error);
        res.status(500).json({ success: false, message: `Erro ao criar turma: ${error.message}` });
    }
};

// Listar turmas de um professor
const getClasses = async (req, res) => {
    try {
        const professorId = req.user.id;

        const turmas = await Turma.findAll({
            where: { professor_id: professorId },
            attributes: ['id', 'nome', 'codigo_acesso'],
        });

        res.json({ success: true, turmas });
    } catch (error) {
        console.error('❌ Erro ao listar turmas:', error);
        res.status(500).json({ success: false, message: `Erro ao listar turmas: ${error.message}` });
    }
};

// Listar turmas onde um aluno está inscrito
const getStudentClasses = async (req, res) => {
    try {
        const studentId = req.user.id;

        const turmas = await Turma.findAll({
            include: [{
                model: Utilizador,
                as: 'alunos',
                where: { id: studentId },
                attributes: [],
                through: { attributes: [] }
            }],
            attributes: ['id', 'nome', 'codigo_acesso'],
        });

        res.json({ success: true, turmas });
    } catch (error) {
        console.error('❌ Erro ao listar turmas do aluno:', error);
        res.status(500).json({ success: false, message: `Erro ao listar turmas do aluno: ${error.message}` });
    }
};

// Aluno entrar numa turma através do código de acesso
const joinClass = async (req, res) => {
    try {
        const { codigo_acesso } = req.body;
        const studentId = req.user.id;

        const turma = await Turma.findOne({ where: { codigo_acesso } });

        if (!turma) {
            return res.status(404).json({ success: false, message: 'Turma não encontrada.' });
        }

        const existingEnrollment = await TurmaAluno.findOne({
            where: {where: { aluno_id: studentId, turma_id: turma.id }}
        });

        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Já estás inscrito nesta turma.' });
        }

        await TurmaAluno.create({ aluno_id: studentId, turma_id: turma.id });
        res.json({ success: true, message: 'Inscrição realizada com sucesso!' });

    } catch (error) {
        console.error('❌ Erro ao entrar na turma:', error);
        res.status(500).json({ success: false, message: `Erro ao entrar na turma: ${error.message}` });
    }
};

// Listar todos os jogos disponíveis
const getGames = async (req, res) => {
    try {
        const jogos = await Jogo.findAll();
        res.json({ success: true, jogos });
    } catch (error) {
        console.error('❌ Erro ao listar jogos:', error);
        res.status(500).json({ success: false, message: `Erro ao listar jogos: ${error.message}` });
    }
};

const getStudentStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Aqui colocas a lógica para calcular a streak e os pontos totais
        // Exemplo (simplesmente fictício):
        const totalPontos = await PontuacaoJogo.sum('pontuacao', {
            where: { aluno_id: studentId }
        });

        const streakAtual = 0; // Aqui podes futuramente implementar lógica de streak real

        res.json({ streak: streakAtual, points: totalPontos || 0 });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ error: "Erro ao obter estatísticas do aluno" });
    }
};
const getLearningMaterials = async (req, res) => {
    try {
        // Exemplo de dados simulados — depois podes guardar na base de dados
        const materials = [
            { title: "Segurança em Redes", level: "beginner", description: "Aprende conceitos básicos de segurança em redes." },
            { title: "Criptografia", level: "intermediate", description: "Como proteger dados com técnicas de criptografia." },
            { title: "Pentesting", level: "advanced", description: "Teste a segurança de sistemas como um profissional." }
        ];

        res.json(materials); // <- aqui podes manter simples e direto
    } catch (error) {
        console.error("Erro ao carregar materiais:", error);
        res.status(500).json({ error: "Erro ao carregar materiais." });
    }
};



// Export único com todas as funções organizadas
module.exports = {
    createClass,
    getClasses,
    getStudentClasses,
    joinClass,
    getGames,
    getStudentStats,
    getLearningMaterials

};
