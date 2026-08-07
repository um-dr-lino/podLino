const Comment = require("./commentModel");
const Video = require("../video/videoModel");
const User = require("../user/userModel");
const notificationService = require('../notification/notificationService');



async function addComment(userId, videoId, content) {
    if (!content || content.trim() === '') {
        throw new Error('O comentário não pode ser vazio.');
    }

    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error('Vídeo não encontrado.');
    }

    const comment = await Comment.create({ userId, videoId, content });
    await video.increment('commentsCount');

    if (userId !== video.userId) { 
        await notificationService.createCommentNotification(userId, video.userId, video.title, video.id);
    }

    return comment;
}



async function getCommentsByVideoId(videoId) {
    const comments = await Comment.findAll({
        where: { videoId },
        include: [{
            model: User,
            attributes: ["username", "fullName", "profilePicture"]
        }],
        order: [["createdAt", "DESC"]]
    });
    return comments;
}


module.exports = {
    addComment,
    getCommentsByVideoId
};