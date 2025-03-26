module.exports = (sequelize, DataTypes) => {
    const Turma = sequelize.define('Turma', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        professor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'utilizadores', // Nome correto da tabela
                key: 'id'
            }
        },
        codigo_acesso: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true,
        tableName: 'turmas',
        createdAt: 'createdat',
        updatedAt: 'updatedat'
    });

    return Turma;
};
