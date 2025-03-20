// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilizador = require('../models/Utilizador'); // Usa o modelo Sequelize
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
        logger.warn('Campos obrigatórios não preenchidos');
        // Valida campos obrigatórios

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Todos os campos (name, email, password, role) são obrigatórios!' });
        }

        // Valida o role
        if (!['professor', 'aluno'].includes(role)) {
            return res.status(400).json({ error: "Role inválido! Use 'professor' ou 'aluno'." });
        }

        // Verifica se o usuário já existe
        const existingUser = await Utilizador.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Este e-mail já está registrado!" });
        }

        // 🔐 Encripta a senha antes de salvar
        const passwordHash = await bcrypt.hash(password, 10);

        // 📌 Insere o usuário no banco de dados usando o modelo Sequelize
        const novoUtilizador = await Utilizador.create({ name, email, password_hash: passwordHash, role });

        logger.info('Usuário registrado com sucesso:', novoUtilizador);
        res.status(201).json({ mensagem: "✅ Usuário registrado com sucesso!", usuario: novoUtilizador });


    } catch (err) {
        logger.error("❌ Erro no registro:", err);

        res.status(500).json({ error: `Erro no servidor: ${err.message}` });
    }
};

// Função para autenticar o usuário (login)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔍 Validação: Garante que o email e a senha foram enviados
        if (!email || !password) {
            return res.status(400).json({ error: "Email e senha são obrigatórios!" });
        }

        logger.info("📩 Dados recebidos:", { email, password });


        // 🔍 Buscar o utilizador no banco de dados usando o modelo Sequelize
        const user = await Utilizador.findOne({ where: { email } });

        logger.info("🔍 Usuário encontrado:", user);


        // ❌ Se o usuário não for encontrado, retorna erro
        if (!user) {
            return res.status(401).json({ error: "❌ Usuário não encontrado!" });
        }

        // 🔑 Comparar a senha inserida com a armazenada no banco de dados
        if (!user.password_hash) {
            return res.status(500).json({ error: "❌ Erro no servidor: Senha não encontrada no banco!" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log("🔑 Senha correta?", passwordMatch);

        // ❌ Se a senha estiver errada, retorna erro
        if (!passwordMatch) {
            return res.status(401).json({ error: "❌ Senha incorreta!" });
        }

        // 🔐 Verifica se JWT_SECRET está definido
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: '❌ Erro de configuração: JWT_SECRET não definido!' });
        }

        // 🔐 Gerar um token JWT para autenticação
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        console.log("✅ Login bem-sucedido para:", user.email);

        // 📌 Retorna os dados do usuário junto com o token
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
