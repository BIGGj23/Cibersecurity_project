if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log("🔍 Variáveis de ambiente carregadas:");
console.log("🌍 Ambiente:", process.env.NODE_ENV || 'development');
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "****" : "Não definida");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const sequelize = require('./config/database');
const gameRoutes = require("./routes/gameRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

// Servir arquivos HTML diretamente da raiz do projeto
const path = require('path');
app.use(express.static(path.join(__dirname, '..'))); // Serve a root do projeto

// Rotas principais
app.use('/auth', authRoutes);
app.use('/classes', classRoutes);
app.use("/games", gameRoutes);

// Rota de teste para ver se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor funcionando! 🚀');
});

// Middleware para capturar erros
app.use((err, req, res, next) => {
    console.error('❌ Erro inesperado:', err.stack);
    res.status(500).json({ error: 'Erro interno no servidor!' });
});

// Middleware para capturar rotas inexistentes
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Conectar ao banco de dados e sincronizar modelos
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conectado ao PostgreSQL com Sequelize!');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('✅ Modelos sincronizados com sucesso!');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    });
