module.exports = (sequelize, DataTypes) => {
    const PontuacaoJogo = sequelize.define('PontuacaoJogo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        aluno_id: {
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
        },
        pontuacao: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        multiplicador: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'pontuacoes_jogos',
        createdAt: 'jogado_em',
        updatedAt: false
    });

    return PontuacaoJogo;
};
