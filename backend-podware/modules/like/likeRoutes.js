const express = require("express");
const router = express.Router();
const likeController = require("./likeController");
const { isAuthenticated } = require("../../middlewares/auth");
const asyncHandler = require("../../middlewares/asyncHandler");


// Alterna o like (curtir/descurtir) de um vídeo
router.post("/videos/:videoId/toggle-like", isAuthenticated, asyncHandler(likeController.toggleLike));

// Verifica o status do like de um vídeo para o usuário logado
router.get("/videos/:videoId/like-status", isAuthenticated, asyncHandler(likeController.checkLikeStatus));

// Lista os vídeos curtidos pelo usuário logado
router.get("/liked-videos", isAuthenticated, asyncHandler(likeController.getLikedVideos));


module.exports = router;
