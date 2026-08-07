const express = require("express");
const router = express.Router();
const followingVideosController = require("./followingVideosController");
const { isAuthenticated } = require("../../middlewares/auth");
const asyncHandler = require("../../middlewares/asyncHandler");

// Lista os vídeos de usuários que o usuário logado segue
router.get("/following-videos", isAuthenticated, asyncHandler(followingVideosController.getFollowingVideos));

module.exports = router;
