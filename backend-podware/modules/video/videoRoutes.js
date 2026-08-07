var express = require("express");
var router = express.Router();

const videoController = require("./videoController");
const { uploadValidator } = require("./videoValidator");
const { isAuthenticated } = require("../../middlewares/auth");
const { optionalAuth } = require("../../middlewares/optionalAuth");
const videoMulter = require("../../middlewares/videoMulter");
const asyncHandler = require("../../middlewares/asyncHandler");


router.post(
    "/videos/upload",
    isAuthenticated,
    videoMulter.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    uploadValidator,
    asyncHandler(videoController.uploadVideo)
);

router.get("/videos/:id/stream", isAuthenticated, asyncHandler(videoController.streamVideo));

router.get("/videos/:id", optionalAuth, asyncHandler(videoController.getVideoDetails));

router.get("/my-videos", isAuthenticated, asyncHandler(videoController.getMyVideos));

router.get("/videos/:id/edit", isAuthenticated, asyncHandler(videoController.getVideoForEdit));

router.put(
    "/videos/:id",
    isAuthenticated,
    videoMulter.single("thumbnail"),
    uploadValidator,
    asyncHandler(videoController.updateVideo)
);

router.delete("/videos/:id", isAuthenticated, asyncHandler(videoController.deleteVideo));


module.exports = router;
