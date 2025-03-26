// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Utilizador } = require('../models/associations'); // Usa o modelo Sequelize
require('dotenv').config();

const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
});

// Função para registrar um novo usuário (aluno ou professor)
exports.registerUser = async (req, res) => {
    logger.info('Iniciando registro de usuário');

    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            logger.warn('Campos obrigatórios não preenchidos');
            return res.status(400).json({ error: 'Todos os campos (name, email, password, role) são obrigatórios!' });
        }

        if (!['professor', 'aluno'].includes(role)) {
            return res.status(400).json({ error: "Role inválido! Use 'professor' ou 'aluno'." });
        }

        const existingUser = await Utilizador.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Este e-mail já está registrado!" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const novoUtilizador = await Utilizador.create({ name, email, password_hash: passwordHash, role });

        logger.info('Usuário registrado com sucesso:', { id: novoUtilizador.id, email: novoUtilizador.email });
        res.status(201).json({ mensagem: "✅ Usuário registrado com sucesso!", usuario: novoUtilizador });

    } catch (err) {
        logger.error("❌ Erro no registro:", err);
        res.status(500).json({ error: `Erro no servidor: ${err.message}` });
    }
};

// Função para autenticar o usuário (login)
exports.loginUser = async (req, res) => {
    try {
        const { email, password, role} = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email e senha são obrigatórios!" });
        }

        logger.info("📩 Dados recebidos:", { email });

        const user = await Utilizador.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "❌ Usuário não encontrado!" });
        }

        if (!user.password_hash) {
            return res.status(500).json({ error: "❌ Erro no servidor: Senha não encontrada no banco!" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: "❌ Senha incorreta!" });
        }

        if (user.role !== role) {
            return res.status(403).json({ error: "A role fornecida não corresponde à do utilizador." });
        }

        if (!["professor", "aluno"].includes(role)) {
            return res.status(400).json({ error: "Role inválido! Use 'professor' ou 'aluno'." });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: '❌ Erro de configuração: JWT_SECRET não definido!' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        logger.info("✅ Login bem-sucedido para:", { email: user.email });

        res.json({
            mensagem: `✅ Bem-vindo, ${user.name}!`,
            token,
            id: user.id,
            tipo: user.role
        });

    } catch (err) {
        logger.error("❌ Erro no servidor:", err);
        res.status(500).json({ error: `Erro interno no servidor: ${err.message}` });
    }
};