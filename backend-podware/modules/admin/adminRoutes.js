const express = require('express');
const router = express.Router();
const adminController = require('./adminController');
const { isAuthenticated } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/adminAuth');
const asyncHandler = require('../../middlewares/asyncHandler');

// Todas as rotas administrativas exigem, nesta ordem: token válido (isAuthenticated)
// e, em seguida, privilégio de administrador (isAdmin, que depende de req.user já existir).
router.use(isAuthenticated, isAdmin);

router.get('/admin/dashboard', asyncHandler(adminController.getDashboard));

router.get('/admin/reports', asyncHandler(adminController.getReports));
router.post('/admin/reports/:reportId/action', asyncHandler(adminController.handleReportAction));

router.get('/admin/users', asyncHandler(adminController.getUsers));
router.post('/admin/users/:userId/toggle-block', asyncHandler(adminController.toggleUserBlock));

router.get('/admin/videos', asyncHandler(adminController.getVideos));
router.delete('/admin/videos/:videoId', asyncHandler(adminController.deleteVideoAdmin));

module.exports = router;
