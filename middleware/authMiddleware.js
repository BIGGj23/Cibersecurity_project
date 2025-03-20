const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_jwt');
        req.user = decoded; // Adiciona o usuário decodificado ao req (ex.: { id: 1, role: 'professor' })
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;