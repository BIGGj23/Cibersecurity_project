const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
    createClass,
    getClasses,
    getStudentClasses,
    joinClass,
    getGames,
    getStudentStats,
    getLearningMaterials
    
} = require('../controllers/classController');

const router = express.Router();

// Rotas para professores
router.post('/create', authMiddleware, createClass);
router.get('/professor', authMiddleware, getClasses);

// Rotas para alunos
router.get('/student', authMiddleware, getStudentClasses);
router.post('/join', authMiddleware, joinClass);

// Rotas gerais (por exemplo, jogos disponíveis)
router.get('/games', authMiddleware, getGames);
router.get('/student/stats', authMiddleware, getStudentStats);
router.get('/materials', authMiddleware, getLearningMaterials);



module.exports = router;
