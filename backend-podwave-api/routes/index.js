var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse');

router.get(['/','/api'], (req, res) => {
    return success(res, {
        name: 'Pod Lino - API',
        version: '1.0.0',
        status: 'online'
    }, 'Bem-vindo à API do PodLino-App.');
});

module.exports = router;
