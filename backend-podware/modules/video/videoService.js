const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const sequelize = require("sequelize");

const Video = require("./videoModel");
const User = require("../user/userModel");
const Follow = require("../follow/followModel");
const Like = require("../like/likeModel");
const Comment = require("../comment/commentModel");
const PlaylistVideo = require("../playlist/playlistVideoModel");
const Report = require("../report/reportModel");

const notificationService = require('../notification/notificationService');


async function uploadVideo(title, description, videoFile, thumbnailFile, userId) {
    if (!videoFile || !thumbnailFile) {
        throw new Error("Por favor, envie o vídeo e a capa.");
    }

    const newVideo = await Video.create({
        title,
        description,
        videoPath: videoFile.filename,
        thumbnailPath: thumbnailFile.filename,
        userId,
    });
    await User.increment("videosCount", { where: { id: userId } });

    await notificationService.createNewVideoNotification(userId, newVideo.id, newVideo.title);
    
    return newVideo;
}


async function streamVideo(videoId) {
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }
    await video.increment("views");
    return video;
}


async function getVideoDetails(videoId, currentUserId = null) {
    const video = await Video.findByPk(videoId, {
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        attributes: {
            include: [
                [sequelize.literal("(SELECT COUNT(*) FROM `likes` WHERE `likes`.`video_id` = `Video`.`id`)"), "likesCount"],
                [sequelize.literal("(SELECT COUNT(*) FROM `comments` WHERE `comments`.`video_id` = `Video`.`id`)"), "commentsCount"]
            ]
        }
    });

    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }

    let isLiked = false;
    if (currentUserId) {
        const existingLike = await Like.findOne({ where: { userId: currentUserId, videoId } });
        isLiked = !!existingLike;
    }

    return { video, isLiked };
}


async function getFeedVideos(currentUserId = null, offset = 0, limit = 20) {
    let whereClause = {};
    let followedUserIds = [];

    if (currentUserId) {
        // Encontrar IDs dos usuários que o currentUserId segue
        const follows = await Follow.findAll({
            where: { followerId: currentUserId },
            attributes: ["followingId"]
        });
        followedUserIds = follows.map(follow => follow.followingId);

        if (followedUserIds.length > 0) {
            // Se segue alguém, prioriza vídeos desses usuários
            whereClause = { userId: { [Op.in]: followedUserIds } };
        }
    }

    // Primeiro, tenta buscar vídeos de usuários seguidos (se houver)
    let videos = await Video.findAll({
        where: whereClause,
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        order: [["createdAt", "DESC"]],
        offset,
        limit
    });

    // Se não houver vídeos de seguidos ou se o usuário não segue ninguém, ou se não preencheu o limite, busca vídeos globais
    if (videos.length < limit && (currentUserId === null || followedUserIds.length === 0 || videos.length === 0)) {
        const globalVideosToFetch = limit - videos.length;
        const globalVideos = await Video.findAll({
            where: { ...whereClause, id: { [Op.notIn]: videos.map(v => v.id) } }, // Evita duplicatas
            include: [{
                model: User,
                attributes: ["id", "username", "fullName", "profilePicture"]
            }],
            order: [["createdAt", "DESC"]],
            offset: offset > 0 ? offset - videos.length : 0, // Ajusta o offset para buscar globalmente
            limit: globalVideosToFetch
        });
        videos = [...videos, ...globalVideos];
    }

    return videos;
}


async function getAllVideos() {
    // usada como fallback/listagem administrativa simples
    const videos = await Video.findAll({
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        order: [["createdAt", "DESC"]],
        limit: 20
    });
    return videos;
}


async function getVideosFromFollowing(userId) {
    const following = await Follow.findAll({
        where: { followerId: userId },
        attributes: ["followingId"]
    });
    const followingIds = following.map(f => f.followingId);

    if (followingIds.length === 0) {
        return [];
    }

    const videos = await Video.findAll({
        where: { userId: { [Op.in]: followingIds } },
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        order: [["createdAt", "DESC"]]
    });
    return videos;
}


async function countVideos() {
    return await Video.count();
}


async function getAllVideosAdmin() {
    return await Video.findAll({
        include: [{ model: User, attributes: ['username', 'fullName'] }],
        order: [['createdAt', 'DESC']]
    });
}


async function deleteVideo(videoId, requestingUserId, isAdmin = false) {
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }

    if (!isAdmin && video.userId !== requestingUserId) {
        const error = new Error("Você não tem permissão para excluir este vídeo.");
        error.status = 403;
        throw error;
    }

    // Remove os arquivos físicos do disco
    const videoFilePath = path.join(__dirname, "../../public/uploads/videos", video.videoPath);
    const thumbnailFilePath = path.join(__dirname, "../../public/uploads/covers", video.thumbnailPath);
    [videoFilePath, thumbnailFilePath].forEach((filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    // Remove registros relacionados antes do vídeo (sem cascade configurado no Sequelize)
    await Like.destroy({ where: { videoId } });
    await Comment.destroy({ where: { videoId } });
    await PlaylistVideo.destroy({ where: { videoId } });
    await Report.destroy({ where: { videoId } });

    await User.decrement("videosCount", { where: { id: video.userId } });
    await video.destroy();

    return { message: "Vídeo excluído com sucesso." };
}


async function getVideosByUser(userId) {
    return await Video.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]]
    });
}


async function getVideoForEdit(videoId, userId) {
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }
    if (video.userId !== userId) {
        const error = new Error("Você não tem permissão para editar este vídeo.");
        error.status = 403;
        throw error;
    }
    return video;
}


async function updateVideo(videoId, userId, title, description, newThumbnailFile) {
    const video = await getVideoForEdit(videoId, userId);

    video.title = title;
    video.description = description;

    if (newThumbnailFile) {
        const oldThumbnailPath = path.join(__dirname, "../../public/uploads/covers", video.thumbnailPath);
        if (fs.existsSync(oldThumbnailPath)) {
            fs.unlinkSync(oldThumbnailPath);
        }
        video.thumbnailPath = newThumbnailFile.filename;
    }

    await video.save();
    return video;
}


async function getFeaturedVideos(limit = 4) {
    return await Video.findAll({
        include: [{
            model: User,
            attributes: ["id", "username", "fullName", "profilePicture"]
        }],
        order: [["views", "DESC"]],
        limit
    });
}



module.exports = {
    uploadVideo,
    streamVideo,
    getAllVideos,
    getVideoDetails,
    getFeedVideos,
    getVideosFromFollowing,
    countVideos, 
    getAllVideosAdmin,
    deleteVideo,
    updateVideo,
    getVideoForEdit,
    getVideosByUser,
    getFeaturedVideos
};