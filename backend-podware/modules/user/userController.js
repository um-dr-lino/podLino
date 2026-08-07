const userService = require("./userService");
const videoService = require("../video/videoService");
const { generateToken } = require("../../config/jwt");
const { success } = require("../../middlewares/apiResponse");

const asyncHandler = require("../../middlewares/asyncHandler");


// POST /api/register
exports.register = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, fullName } = req.body;

    const newUser = await userService.registerUser(username, email, password, fullName);

    return success(
        res,
        { id: newUser.id, username: newUser.username, email: newUser.email },
        "Conta criada com sucesso! Faça login para continuar.",
        201
    );
});


// POST /api/login
exports.login = asyncHandler(async (req, res) => {
    const { login, password } = req.body;

    const user = await userService.loginUser(login, password);
    const userData = await userService.getUserProfile(user.id);

    // Payload do token: apenas o essencial para autorização, nunca a senha.
    const token = generateToken({
        id: userData.id,
        username: userData.username,
        isAdmin: userData.isAdmin
    });

    return success(
        res,
        { token, user: userData },
        `Bem-vindo de volta, ${userData.username}!`
    );
});


// POST /api/logout
// Com JWT o "logout" é responsabilidade do cliente (descartar o token guardado).
// Mantemos o endpoint por consistência e para permitir, no futuro, uma blacklist de tokens.
exports.logout = (req, res) => {
    return success(res, null, "Logout realizado com sucesso.");
};


// GET /api/profile/me
exports.getMyProfile = asyncHandler(async (req, res) => {
    const userData = await userService.getUserProfile(req.user.id);
    return success(res, userData);
});


// PUT /api/profile/me
exports.updateProfile = asyncHandler(async (req, res) => {
    const { fullName, bio } = req.body;
    const userId = req.user.id;
    const newProfilePictureFilename = req.file ? req.file.filename : null;

    const updatedUser = await userService.updateUserProfile(userId, fullName, bio, newProfilePictureFilename);

    return success(res, updatedUser, "Perfil atualizado com sucesso!");
});


// GET /api/profile/:username
exports.getPublicProfile = asyncHandler(async (req, res) => {
    const username = req.params.username;
    const user = await userService.getPublicProfile(username);

    const isOwner = !!(req.user && req.user.id === user.id);
    let isFollowing = false;
    if (!isOwner && req.user) {
        const followStatus = await userService.getFollowStatusForUser(req.user.id, user.id);
        isFollowing = followStatus.isFollowing;
    }

    return success(res, { ...user.toJSON(), isOwner, isFollowing });
});


// GET /api/feed
exports.getFeed = asyncHandler(async (req, res) => {
    const currentUserId = req.user ? req.user.id : null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const videos = await videoService.getFeedVideos(currentUserId, offset, limit);

    return success(res, videos);
});
