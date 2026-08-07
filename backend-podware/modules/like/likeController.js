const likeService = require("./likeService");
const { success } = require("../../middlewares/apiResponse");


// POST /api/videos/:videoId/toggle-like
exports.toggleLike = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    const result = await likeService.toggleLike(userId, videoId);
    const statusCode = result.status === "liked" ? 201 : 200;

    return success(res, { status: result.status }, result.message, statusCode);
};


// GET /api/videos/:videoId/like-status
exports.checkLikeStatus = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    const liked = await likeService.checkLikeStatus(userId, videoId);
    return success(res, { liked });
};


// GET /api/liked-videos
exports.getLikedVideos = async (req, res) => {
    const userId = req.user.id;
    const likedVideos = await likeService.getLikedVideos(userId);
    return success(res, likedVideos);
};
