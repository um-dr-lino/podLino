// middlewares/auth.js
// Autenticação via JWT. O cliente (Vue) deve enviar o token no header:
//   Authorization: Bearer <token>
const { verifyToken } = require('../config/jwt');
const { error: errorResponse } = require('./apiResponse');

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Você precisa estar autenticado para acessar este recurso.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // payload do token: { id, username, isAdmin, ... }
        return next();
    } catch (err) {
        return errorResponse(res, 'Token inválido ou expirado. Faça login novamente.', 401);
    }
};

module.exports = { isAuthenticated };
