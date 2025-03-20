const Utilizador = require('./Utilizador');
const Turma = require('./Turma');
const TurmaAluno = require('./TurmaAluno');

// Relacionamento: Turma tem muitos alunos (Utilizadores) através de TurmaAluno
Turma.belongsToMany(Utilizador, {
    through: TurmaAluno,
    as: 'alunos',
    foreignKey: 'turma_id',
    otherKey: 'utilizador_id'
});

// Relacionamento: Utilizador pertence a muitas turmas através de TurmaAluno
Utilizador.belongsToMany(Turma, {
    through: TurmaAluno,
    as: 'turmas',
    foreignKey: 'utilizador_id',
    otherKey: 'turma_id'
});

// Relacionamento: Turma pertence a um professor (Utilizador)
Turma.belongsTo(Utilizador, {
    foreignKey: 'professor_id',
    as: 'professor'
});

module.exports = { Utilizador, Turma, TurmaAluno };