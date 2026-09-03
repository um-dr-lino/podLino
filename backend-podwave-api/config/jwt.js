const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
