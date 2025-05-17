const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Importar os modelos
const Utilizador = require('./Utilizador')(sequelize, Sequelize.DataTypes);
const Turma = require('./Turma')(sequelize, Sequelize.DataTypes);
const Jogo = require('./Jogo')(sequelize, Sequelize.DataTypes);
const TurmaAluno = require('./TurmaAluno')(sequelize, Sequelize.DataTypes);
const PontuacaoJogo = require('./PontJogo')(sequelize, Sequelize.DataTypes);

// Definir associações

// Um professor pode ter muitas turmas
Utilizador.hasMany(Turma, { foreignKey: 'professor_id', as: 'turmas_ensina' });
Turma.belongsTo(Utilizador, { foreignKey: 'professor_id', as: 'professor' });

// Turmas têm muitos alunos (relação N:N através de TurmaAluno)
Turma.belongsToMany(Utilizador, { through: TurmaAluno, as: 'alunos', foreignKey: 'turma_id', otherKey: 'aluno_id' });
Utilizador.belongsToMany(Turma, { through: TurmaAluno, as: 'turmas', foreignKey: 'aluno_id', otherKey: 'turma_id' });

// Jogos têm muitas pontuações
Jogo.hasMany(PontuacaoJogo, { foreignKey: 'jogo_id', as: 'pontuacoes' });
PontuacaoJogo.belongsTo(Utilizador, { foreignKey: 'aluno_id', as: 'utilizador' });
PontuacaoJogo.belongsTo(Jogo, { foreignKey: 'jogo_id', as: 'jogo' });

// Relação para permitir contagem de alunos por turma
Turma.hasMany(TurmaAluno, { foreignKey: 'turma_id', as: 'inscricoes' });
TurmaAluno.belongsTo(Turma, { foreignKey: 'turma_id' });


// Exportar modelos e sequelize
const SequelizeLib = require('sequelize');

module.exports = {
    sequelize,
    Utilizador,
    Turma,
    Jogo,
    TurmaAluno,
    PontuacaoJogo,
    Sequelize: SequelizeLib
};