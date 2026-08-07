const videoService = require("./videoService");
const fs = require("fs");
const path = require("path");
const { success } = require("../../middlewares/apiResponse");


// POST /api/videos/upload
exports.uploadVideo = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    // A validação de arquivos deve ser feita aqui ou no service, antes de chamar o service.
    // O express-validator valida os campos de texto, mas não a existência de arquivos.
    if (!videoFile || !thumbnailFile) {
        const error = new Error("Por favor, envie o vídeo e a capa.");
        error.status = 400;
        throw error;
    }

    const newVideo = await videoService.uploadVideo(title, description, videoFile, thumbnailFile, userId);

    return success(res, newVideo, "Vídeo enviado com sucesso!", 201);
};


// GET /api/videos/:id/stream
exports.streamVideo = async (req, res) => {
    const videoId = req.params.id;

    const video = await videoService.streamVideo(videoId);

    const videoPath = path.join(__dirname, "../../public/uploads/videos", video.videoPath);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
};


// GET /api/videos/:id
exports.getVideoDetails = async (req, res) => {
    const videoId = req.params.id;
    const currentUserId = req.user ? req.user.id : null;

    const { video, isLiked } = await videoService.getVideoDetails(videoId, currentUserId);
    const isOwner = currentUserId === video.userId;

    return success(res, { ...video.toJSON(), isLiked, isOwner });
};


// GET /api/my-videos
exports.getMyVideos = async (req, res) => {
    const userId = req.user.id;
    const videos = await videoService.getVideosByUser(userId);
    return success(res, videos);
};


// GET /api/videos/:id/edit
// Retorna os dados "crus" do vídeo para pré-preencher um formulário de edição.
exports.getVideoForEdit = async (req, res) => {
    const videoId = req.params.id;
    const userId = req.user.id;
    const video = await videoService.getVideoForEdit(videoId, userId);
    return success(res, video);
};


// PUT /api/videos/:id
exports.updateVideo = async (req, res) => {
    const videoId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;
    const newThumbnailFile = req.file || null;

    const updatedVideo = await videoService.updateVideo(videoId, userId, title, description, newThumbnailFile);

    return success(res, updatedVideo, "Vídeo atualizado com sucesso!");
};


// DELETE /api/videos/:id
exports.deleteVideo = async (req, res) => {
    const videoId = req.params.id;
    const userId = req.user.id;

    await videoService.deleteVideo(videoId, userId, false);

    return success(res, null, "Vídeo excluído com sucesso.");
};
