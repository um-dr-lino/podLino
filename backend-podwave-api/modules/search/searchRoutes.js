const express = require('express');
const router = express.Router();
const searchController = require('./searchController');

// Busca global por podcasts e usuários. Rota pública.
router.get('/search', searchController.search);

module.exports = router;