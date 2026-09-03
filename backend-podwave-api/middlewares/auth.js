const { verifyToken } = require('../config/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error('Token não fornecido.');
        error.status = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyToken(token);
        return next();
    } catch (err) {
        const error = new Error('Token inválido ou expirado.');
        error.status = 401;
        return next(error);
    }
};
