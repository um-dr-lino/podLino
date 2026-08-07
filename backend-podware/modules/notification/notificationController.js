const notificationService = require('./notificationService');
const { success } = require('../../middlewares/apiResponse');

// GET /api/notifications
exports.getNotifications = async (req, res) => {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    return success(res, notifications);
};

// POST /api/notifications/:notificationId/read
exports.markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await notificationService.markAsRead(notificationId, userId);
    return success(res, null, "Notificação marcada como lida.");
};

// GET /api/notifications/unread-count
exports.getUnreadCount = async (req, res) => {
    const userId = req.user.id;
    const count = await notificationService.getUnreadNotificationsCount(userId);
    return success(res, { count });
};
