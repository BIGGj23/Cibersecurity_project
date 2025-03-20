const sequelize = require('../config/database');
const Utilizador = require('./Utilizador');
const Turma = require('./Turma');
const Jogo = require('./Jogo');
const TurmaAluno = require('./TurmaAluno');

// Carrega as associações
require('./associations');

module.exports = {
    sequelize,
    Utilizador,
    Turma,
    Jogo,
    TurmaAluno
};