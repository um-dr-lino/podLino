const express = require("express");
const router = express.Router();
const playlistController = require("./playlistController");
const { createPlaylistValidator } = require("./playlistValidator");
const { isAuthenticated } = require("../../middlewares/auth");
const { optionalAuth } = require("../../middlewares/optionalAuth");
const asyncHandler = require("../../middlewares/asyncHandler");

router.get("/my-playlists", isAuthenticated, asyncHandler(playlistController.getMyPlaylists));
router.get("/playlists/:id", optionalAuth, asyncHandler(playlistController.getPlaylistDetails));
router.post("/playlists", isAuthenticated, createPlaylistValidator, asyncHandler(playlistController.createPlaylist));
router.post("/playlists/:id/videos", isAuthenticated, asyncHandler(playlistController.addVideoToPlaylist));
router.delete("/playlists/:id/videos/:videoId", isAuthenticated, asyncHandler(playlistController.removeVideoFromPlaylist));
router.delete("/playlists/:id", isAuthenticated, asyncHandler(playlistController.deletePlaylist));
router.get("/videos/:videoId/playlists-status", isAuthenticated, asyncHandler(playlistController.getPlaylistsForVideo));

module.exports = router;
