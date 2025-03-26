module.exports = (sequelize, DataTypes) => {
    const Jogo = sequelize.define('Jogo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'jogos',
        createdAt: 'criado_em',
        updatedAt: false // Não tem `updated_at` na DB
    });

    return Jogo;
};
