// middlewares/adminAuth.js
// Deve ser usado sempre APÓS o middleware isAuthenticated,
// pois depende de req.user já ter sido preenchido a partir do token.
const { error: errorResponse } = require('./apiResponse');

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return errorResponse(res, 'Acesso negado. Você não tem permissão de administrador.', 403);
};
