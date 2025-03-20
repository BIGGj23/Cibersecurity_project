const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

// 📌 Configuração da conexão com o Postgres
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// 📌 Testa a conexão com o Postgres
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro ao conectar ao Postgres:', err.stack);
    } else {
        console.log('✅ Conectado ao Postgres com sucesso!');
    }
    release();
});

// 📌 Rota de Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('📩 Dados recebidos:', { email, password, role });

        // 🔍 Validação de campos obrigatórios
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Email, senha e role são obrigatórios.' });
        }

        // 🔍 Busca o usuário no Postgres
        const query = 'SELECT id, name, email, password_hash, role FROM utilizadores WHERE LOWER(email) = LOWER($1) AND LOWER(role) = LOWER($2)';
        const values = [email, role];
        const result = await pool.query(query, values);

        console.log('🔍 Usuário encontrado:', result.rows);

        // 🔍 Verifica se o usuário foi encontrado
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const user = result.rows[0];

        // 📌 Verifica se a senha está definida no banco (evita erro `bcrypt.compare`)
        if (!user.password_hash) {
            console.error('❌ Erro no login: O usuário não tem uma senha armazenada.');
            return res.status(500).json({ success: false, message: 'Erro no servidor.' });
        }

        // 🔑 Comparação da senha
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('🔑 Senha corresponde:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        // 🔐 Gera um token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 📌 Retorna o token e o ID do usuário
        res.json({ success: true, token, id: user.id });

    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});

module.exports = router;
