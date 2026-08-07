var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse');

// Rota raiz da API - útil para verificar rapidamente se o servidor está no ar.
router.get('/', (req, res) => {
    return success(res, {
        name: 'Shortz-App API',
        version: '1.0.0',
        status: 'online'
    }, 'Bem-vindo à API do Shortz-App.');
});

module.exports = router;
