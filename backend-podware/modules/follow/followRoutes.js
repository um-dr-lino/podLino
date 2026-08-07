const express = require("express");
const router = express.Router();
const followController = require("./followController");
const { isAuthenticated } = require("../../middlewares/auth");
const asyncHandler = require("../../middlewares/asyncHandler");

// Alterna o seguimento (seguir/deixar de seguir) de um usuário
router.post("/users/:userId/toggle-follow", isAuthenticated, asyncHandler(followController.toggleFollow));

// Verifica o status de seguimento de um usuário para o usuário logado
router.get("/users/:userId/follow-status", isAuthenticated, asyncHandler(followController.getFollowStatus));

// Lista seguidores e quem o usuário segue
router.get("/users/:userId/followers", isAuthenticated, asyncHandler(followController.getFollowers));
router.get("/users/:userId/following", isAuthenticated, asyncHandler(followController.getFollowing));

module.exports = router;
