const commentService = require("./commentService");
const { success } = require("../../middlewares/apiResponse");


// POST /api/videos/:videoId/comments
exports.addComment = async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const newComment = await commentService.addComment(videoId, userId, content);
    return success(res, newComment, "Comentário adicionado com sucesso!", 201);
};


// GET /api/videos/:videoId/comments
exports.getComments = async (req, res) => {
    const { videoId } = req.params;

    const comments = await commentService.getCommentsByVideoId(videoId);
    return success(res, comments);
};
