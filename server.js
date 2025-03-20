require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const app = express();

const sequelize = require('./config/database');
require('./models/associations');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

const path = require('path');
// Serve arquivos estáticos diretamente da pasta raiz do projeto (Projeto/)
app.use(express.static(path.join(__dirname, '..')));

// Rota padrão para testar o servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando! 🚀');
});

app.use('/auth', authRoutes);
app.use('/classes', classRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err.stack);
    res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Modelos sincronizados com sucesso!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao sincronizar modelos:', err);
        process.exit(1);
    });