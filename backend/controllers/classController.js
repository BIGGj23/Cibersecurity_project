const { Turma, Utilizador, Jogo, TurmaAluno, PontuacaoJogo, Sequelize } = require('../models/associations');

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
            attributes: [
                'id', 'nome', 'codigo_acesso',
                [Sequelize.fn("COUNT", Sequelize.col("inscricoes.aluno_id")), "numero_alunos"]
            ],
            include: [{
                model: TurmaAluno,
                as: 'inscricoes',
                attributes: []
            }],
            group: ['Turma.id'],
            raw: true
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
            include: [
                {
                    model: Utilizador,
                    as: 'alunos',
                    where: { id: studentId },
                    attributes: [],
                    through: { attributes: [] }
                },
                {
                    model: TurmaAluno,
                    as: 'inscricoes',
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'nome',
                'codigo_acesso',
                [Sequelize.fn("COUNT", Sequelize.col("inscricoes.aluno_id")), "numero_alunos"]
            ],
            group: ['Turma.id'],
            raw: true
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
            where: { aluno_id: studentId, turma_id: turma.id }
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

// ✅ Listar todos os jogos disponíveis (corrigido)
const getGames = async (req, res) => {
    try {
        const jogos = await Jogo.findAll({
            attributes: ['id', 'titulo', 'descricao', 'nivel', 'pontos']
        });
        res.json({ success: true, jogos });
    } catch (error) {
        console.error('❌ Erro ao listar jogos:', error);
        res.status(500).json({ success: false, message: `Erro ao listar jogos: ${error.message}` });
    }
};

const getStudentStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        const totalPontos = await PontuacaoJogo.sum('pontuacao', {
            where: { aluno_id: studentId }
        });

        const jogadas = await PontuacaoJogo.findAll({
            where: { aluno_id: studentId },
            order: [['jogado_em', 'DESC']],
            limit: 10
        });

        let streakAtual = 0;
        for (const jogada of jogadas) {
            if (jogada.pontuacao > 0) {
                streakAtual++;
            } else {
                break;
            }
        }

        res.json({ streak: streakAtual, points: totalPontos || 0 });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ error: "Erro ao obter estatísticas do aluno" });
    }
};

const getLearningMaterials = async (req, res) => {
    try {
        const materials = [
            { title: "Segurança em Redes", level: "beginner", description: "Aprende conceitos básicos de segurança em redes." },
            { title: "Criptografia", level: "intermediate", description: "Como proteger dados com técnicas de criptografia." },
            { title: "Pentesting", level: "advanced", description: "Teste a segurança de sistemas como um profissional." }
        ];

        res.json(materials);
    } catch (error) {
        console.error("Erro ao carregar materiais:", error);
        res.status(500).json({ error: "Erro ao carregar materiais." });
    }
};

module.exports = {
    createClass,
    getClasses,
    getStudentClasses,
    joinClass,
    getGames,
    getStudentStats,
    getLearningMaterials
};
