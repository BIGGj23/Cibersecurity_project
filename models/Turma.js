const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigo_acesso: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'turmas'
});

module.exports = Turma;