const { Turma, Utilizador, sequelize, Jogo, TurmaAluno } = require('../models');

const createClass = async (req, res) => {
    try {
        const { nome, codigo_acesso } = req.body;
        const professorId = 1; // Substitua por req.user.id quando reativar authMiddleware
        const turma = await Turma.create({ nome, codigo_acesso, professor_id: professorId });
        res.status(201).json({ success: true, message: 'Turma criada com sucesso', turma });
    } catch (error) {
        console.error('❌ Erro ao criar turma:', error);
        res.status(500).json({ success: false, message: `Erro ao criar turma: ${error.message}` });
    }
};

const getClasses = async (req, res) => {
    try {
        const professorId = 1; // Substitua por req.user.id quando reativar authMiddleware
        const turmas = await Turma.findAll({
            where: { professor_id: professorId },
            attributes: ['id', 'nome', 'codigo_acesso'],
            include: [
                {
                    model: Utilizador,
                    as: 'alunos',
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            group: ['Turma.id'],
            having: sequelize.literal('COUNT("alunos"."id") >= 0')
        });
        res.json({ turmas });
    } catch (error) {
        console.error('❌ Erro ao listar turmas:', error);
        res.status(500).json({ success: false, message: `Erro ao listar turmas: ${error.message}` });
    }
};

const getStudentClasses = async (req, res) => {
    try {
        const studentId = 2; // Substitua por req.user.id quando reativar authMiddleware
        const turmas = await Turma.findAll({
            include: [
                {
                    model: Utilizador,
                    as: 'alunos',
                    where: { id: studentId },
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            group: ['Turma.id'],
            having: sequelize.literal('COUNT("alunos"."id") > 0')
        });
        res.json({ turmas });
    } catch (error) {
        console.error('❌ Erro ao listar turmas do aluno:', error);
        res.status(500).json({ success: false, message: `Erro ao listar turmas do aluno: ${error.message}` });
    }
};

const joinClass = async (req, res) => {
    try {
        const { codigo_acesso } = req.body;
        const studentId = 2; // Substitua por req.user.id quando reativar authMiddleware
        const turma = await Turma.findOne({ where: { codigo_acesso } });
        if (!turma) {
            return res.status(404).json({ success: false, message: 'Turma não encontrada' });
        }
        const existingEnrollment = await TurmaAluno.findOne({
            where: { utilizador_id: studentId, turma_id: turma.id }
        });
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Você já está inscrito nesta turma' });
        }
        await TurmaAluno.create({ utilizador_id: studentId, turma_id: turma.id });
        res.json({ success: true, message: 'Entrou na turma com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao entrar na turma:', error);
        res.status(500).json({ success: false, message: `Erro ao entrar na turma: ${error.message}` });
    }
};

const getGames = async (req, res) => {
    try {
        console.log('Buscando jogos no banco de dados...');
        const jogos = await Jogo.findAll();
        console.log('Jogos encontrados:', jogos);
        res.json(jogos);
    } catch (error) {
        console.error('❌ Erro ao listar jogos:', error);
        res.status(500).json({ success: false, message: `Erro ao listar jogos: ${error.message}` });
    }
};

module.exports = {
    createClass,
    getClasses,
    getStudentClasses,
    joinClass,
    getGames
};