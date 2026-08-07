const reportService = require('./reportService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/videos/:videoId/report
exports.reportVideo = async (req, res) => {
    const { videoId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    await reportService.createReport(userId, videoId, reason);
    return success(res, null, 'Vídeo denunciado com sucesso. Nossa equipe irá analisá-lo.');
};


