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
        },
        nivel: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        pontos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: true,
        tableName: 'jogos',
        createdAt: 'criado_em',
        updatedAt: false
    });

    return Jogo;
};
