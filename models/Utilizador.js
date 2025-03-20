const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilizador = sequelize.define('Utilizador', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'utilizadores'
});

module.exports = Utilizador;