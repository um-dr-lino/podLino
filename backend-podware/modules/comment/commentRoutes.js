const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const { commentValidator } = require("./commentValidator");
const { isAuthenticated } = require("../../middlewares/auth");
const asyncHandler = require("../../middlewares/asyncHandler");


// Adiciona um novo comentário a um vídeo
router.post("/videos/:videoId/comments", isAuthenticated, commentValidator, asyncHandler(commentController.addComment));

// Lista todos os comentários de um vídeo (acesso público, como no sistema original)
router.get("/videos/:videoId/comments", asyncHandler(commentController.getComments));


module.exports = router;
