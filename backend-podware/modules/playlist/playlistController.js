const playlistService = require("./playlistService");
const { success } = require("../../middlewares/apiResponse");


// POST /api/playlists
exports.createPlaylist = async (req, res) => {
    const { title, description, isPublic } = req.body;
    const userId = req.user.id;
    const isPublicBool = isPublic === true || isPublic === "true" || isPublic === "on";

    const newPlaylist = await playlistService.createPlaylist(userId, title, description, isPublicBool);

    return success(res, newPlaylist, "Playlist criada com sucesso!", 201);
};


// GET /api/my-playlists
exports.getMyPlaylists = async (req, res) => {
    const userId = req.user.id;
    const playlists = await playlistService.getUserPlaylists(userId);
    return success(res, playlists);
};


// GET /api/playlists/:id
exports.getPlaylistDetails = async (req, res) => {
    const playlistId = req.params.id;
    const userId = req.user ? req.user.id : null;

    const playlist = await playlistService.getPlaylistById(playlistId, userId);

    return success(res, playlist);
};


// POST /api/playlists/:id/videos
exports.addVideoToPlaylist = async (req, res) => {
    const playlistId = req.params.id;
    const { videoId } = req.body;
    const userId = req.user.id;

    const result = await playlistService.addVideoToPlaylist(playlistId, videoId, userId);

    return success(res, { added: result.success }, result.message, result.success ? 201 : 200);
};


// DELETE /api/playlists/:id/videos/:videoId
exports.removeVideoFromPlaylist = async (req, res) => {
    const { id: playlistId, videoId } = req.params;
    const userId = req.user.id;

    await playlistService.removeVideoFromPlaylist(playlistId, videoId, userId);

    return success(res, null, "Vídeo removido da playlist com sucesso!");
};


// DELETE /api/playlists/:id
exports.deletePlaylist = async (req, res) => {
    const playlistId = req.params.id;
    const userId = req.user.id;

    await playlistService.deletePlaylist(playlistId, userId);

    return success(res, null, "Playlist excluída com sucesso!");
};


// GET /api/videos/:videoId/playlists-status
exports.getPlaylistsForVideo = async (req, res) => {
    const userId = req.user.id;
    const videoId = req.params.videoId;
    const playlists = await playlistService.getUserPlaylistsWithVideoStatus(userId, videoId);
    return success(res, playlists);
};
