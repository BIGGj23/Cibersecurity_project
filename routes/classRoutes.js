const express = require('express');
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Depuração
console.log('classController:', classController);

// Criar turma (somente professores autenticados)
router.post('/create', authMiddleware, classController.createClass);

// Listar turmas do professor autenticado
router.get('/', authMiddleware, classController.getClasses);

// Listar turmas do aluno autenticado
router.get('/student', authMiddleware, classController.getStudentClasses);

// Entrar em uma turma
router.post('/join', authMiddleware, classController.joinClass);

// Listar jogos
router.get('/games', authMiddleware, classController.getGames);

// Listar materiais (mock, a ser ajustado com modelo Material no futuro)
const materials = [
    { title: "What is Cybersecurity?", level: "beginner", description: "An introduction to cybersecurity concepts." },
    { title: "Password Security", level: "beginner", description: "Learn about creating strong passwords." },
    { title: "Social Engineering Threats", level: "beginner", description: "Understand common social engineering tactics." }
];
router.get('/materials', (req, res) => {
    res.json(materials);
});

// Estatísticas do aluno (Streak e Points, mock, a ser ajustado com modelo Estatistica no futuro)
router.get('/student/stats', (req, res) => {
    const stats = {
        streak: 0,
        points: 0
    };
    res.json(stats);
});

module.exports = router;