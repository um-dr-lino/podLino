const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    console.warn('[AVISO] JWT_SECRET não definido no .env. Usando um valor padrão inseguro apenas para desenvolvimento.');
}

/**
 * Gera um token JWT a partir de um payload (normalmente os dados essenciais do usuário).
 * Nunca inclua a senha (nem o hash) no payload.
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET || 'dev_secret_inseguro', { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica e decodifica um token JWT.
 * Lança um erro se o token for inválido ou tiver expirado.
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET || 'dev_secret_inseguro');
}

module.exports = { generateToken, verifyToken };
