const videoService = require("../video/videoService");
const { success } = require("../../middlewares/apiResponse");

// GET /api/following-videos
exports.getFollowingVideos = async (req, res) => {
    const userId = req.user.id;
    const videos = await videoService.getVideosFromFollowing(userId);
    return success(res, videos);
};
