module.exports = (sequelize, DataTypes) => {
    const TurmaAluno = sequelize.define('TurmaAluno', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        turma_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        inscrito_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'turmas_alunos',
        timestamps: false // 🔴 Desativa timestamps para evitar erro!
    });

    return TurmaAluno;
};
