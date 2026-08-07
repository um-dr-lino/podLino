const express = require('express');
const router = express.Router();
const reportController = require('./reportController');
const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');

// Rota para denunciar um vídeo
router.post('/videos/:videoId/report', isAuthenticated, asyncHandler(reportController.reportVideo));

module.exports = router;
