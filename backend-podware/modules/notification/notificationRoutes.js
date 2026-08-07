const express = require('express');
const router = express.Router();
const notificationController = require('./notificationController');
const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');

router.get('/notifications', isAuthenticated, asyncHandler(notificationController.getNotifications));
router.post('/notifications/:notificationId/read', isAuthenticated, asyncHandler(notificationController.markNotificationAsRead));
router.get('/notifications/unread-count', isAuthenticated, asyncHandler(notificationController.getUnreadCount));

module.exports = router;
