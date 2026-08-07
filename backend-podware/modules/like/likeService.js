const Like = require("./likeModel");
const Video = require("../video/videoModel");
const User = require("../user/userModel");
const notificationService = require('../notification/notificationService');


async function toggleLike(userId, videoId) {
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error('Vídeo não encontrado.');
    }

    const [like, created] = await Like.findOrCreate({
        where: { userId, videoId },
        defaults: { userId, videoId }
    });

    if (!created) {
        await like.destroy();
        await video.decrement('likesCount');
        return { status: 'unliked', message: 'Vídeo descurtido.' };
    } else {
        await video.increment('likesCount');
        if (userId !== video.userId) { 
            await notificationService.createLikeNotification(userId, video.userId, video.title, video.id);
        }
        return { status: 'liked', message: 'Vídeo curtido.' };
    }
}


async function checkLikeStatus(userId, videoId) {
    const like = await Like.findOne({ where: { userId, videoId } });
    return !!like;
}


async function getLikedVideos(userId) {
    const likedVideos = await Like.findAll({
        where: { userId },
        include: [{
            model: Video,
            attributes: ["id", "title", "thumbnailPath", "views", "createdAt"],
            include: [{
                model: User,
                attributes: ["id", "username", "fullName", "profilePicture"]
            }]
        }],
        order: [["createdAt", "DESC"]]
    });
    return likedVideos.map(like => like.Video);
}


module.exports = {
    toggleLike,
    checkLikeStatus,
    getLikedVideos
};