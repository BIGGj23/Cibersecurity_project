require('dotenv').config();

const { Sequelize } = require('sequelize');

// Depuração: Verificar as variáveis de ambiente
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// Configurar o Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado ao PostgreSQL!');
    } catch (err) {
        console.error('❌ Erro ao conectar ao PostgreSQL:', err);
        process.exit(1);
    }
})();

module.exports = sequelize;