const followService = require("./followService");
const { success } = require("../../middlewares/apiResponse");


// POST /api/users/:userId/toggle-follow
exports.toggleFollow = async (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.user.id;

    const result = await followService.toggleFollow(followerId, followingId);

    return success(res, { status: result.status }, result.message);
};


// GET /api/users/:userId/follow-status
exports.getFollowStatus = async (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.user.id;

    const { isFollowing } = await followService.getFollowStatus(followerId, followingId);

    return success(res, { isFollowing });
};


// GET /api/users/:userId/followers
exports.getFollowers = async (req, res) => {
    const userId = req.params.userId;
    const followers = await followService.getFollowers(userId);
    return success(res, followers);
};


// GET /api/users/:userId/following
exports.getFollowing = async (req, res) => {
    const userId = req.params.userId;
    const following = await followService.getFollowing(userId);
    return success(res, following);
};
