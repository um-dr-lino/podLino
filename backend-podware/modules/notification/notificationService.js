const Notification = require('./notificationModel');
const User = require('../user/userModel');
const Video = require('../video/videoModel');
const Follow = require('../follow/followModel');

async function createNotification(recipientId, actorId, type, message, link) {
    if (recipientId === actorId) { // Não notificar o próprio usuário por suas ações
        return;
    }
    await Notification.create({ recipientId, actorId, type, message, link });
}

async function getUserNotifications(userId) {
    const notifications = await Notification.findAll({
        where: { recipientId: userId },
        include: [
            { model: User, as: 'Actor', attributes: ['id', 'username', 'profilePicture'] }
        ],
        order: [['createdAt', 'DESC']]
    });
    return notifications;
}

async function markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({ where: { id: notificationId, recipientId: userId } });
    if (notification) {
        notification.isRead = true;
        await notification.save();
    }
    return notification;
}

async function getUnreadNotificationsCount(userId) {
    const count = await Notification.count({ where: { recipientId: userId, isRead: false } });
    return count;
}

// Funções auxiliares para criar tipos específicos de notificações
async function createLikeNotification(likerId, videoOwnerId, videoTitle, videoId) {
    const message = `${(await User.findByPk(likerId)).username} curtiu seu vídeo: ${videoTitle}`;
    const link = `/video/${videoId}`;
    await createNotification(videoOwnerId, likerId, 'like', message, link);
}

async function createCommentNotification(commenterId, videoOwnerId, videoTitle, videoId) {
    const message = `${(await User.findByPk(commenterId)).username} comentou em seu vídeo: ${videoTitle}`;
    const link = `/video/${videoId}`;
    await createNotification(videoOwnerId, commenterId, 'comment', message, link);
}

async function createFollowNotification(followerId, followedId) {
    const message = `${(await User.findByPk(followerId)).username} começou a te seguir.`
    const link = `/profile/@${(await User.findByPk(followerId)).username}`;
    await createNotification(followedId, followerId, 'follow', message, link);
}

async function createNewVideoNotification(uploaderId, videoId, videoTitle) {
    // Notificar todos os seguidores do uploader
    const followers = await Follow.findAll({ where: { followingId: uploaderId } });
    for (const follow of followers) {
        const message = `${(await User.findByPk(uploaderId)).username} publicou um novo vídeo: ${videoTitle}`;
        const link = `/video/${videoId}`;
        await createNotification(follow.followerId, uploaderId, 'new_video', message, link);
    }
}

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    getUnreadNotificationsCount,
    createLikeNotification,
    createCommentNotification,
    createFollowNotification,
    createNewVideoNotification
};