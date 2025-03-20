const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PontuacaoJogo = sequelize.define('PontuacaoJogo', {
    pontuacao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    utilizador_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'utilizadores',
            key: 'id'
        }
    },
    jogo_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'jogos',
            key: 'id'
        }
    }
}, {
    tableName: 'pontuacoes_jogos'
});

module.exports = PontuacaoJogo;