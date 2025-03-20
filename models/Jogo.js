const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogo = sequelize.define('Jogo', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'jogos'
});

module.exports = Jogo;