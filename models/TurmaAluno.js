const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TurmaAluno = sequelize.define('TurmaAluno', {
    utilizador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    turma_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_inscricao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'turmas_alunos'
});

module.exports = TurmaAluno;