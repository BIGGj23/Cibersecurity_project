module.exports = (sequelize, DataTypes) => {
    const Utilizador = sequelize.define("Utilizador", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'utilizadores', // Nome correto da tabela
        createdAt: 'created_at',
        updatedAt: 'update_at'
    });

    return Utilizador;
};
