const express = require("express");
const router = express.Router();
const searchController = require("./searchController");
const asyncHandler = require("../../middlewares/asyncHandler");

// Busca global por vídeos e usuários. Rota pública, como no sistema original.
router.get("/search", asyncHandler(searchController.search));

module.exports = router;
