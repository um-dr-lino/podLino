const reportService = require('../report/reportService');
const videoService = require('../video/videoService');
const userService = require('../user/userService');
const { success } = require('../../middlewares/apiResponse');


// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
    const totalUsers = await userService.countUsers();
    const totalVideos = await videoService.countVideos();
    const allReports = await reportService.getAllReports();
    const pendingReportsCount = allReports.filter(r => r.status === 'pending').length;

    return success(res, { totalUsers, totalVideos, pendingReportsCount });
};


// GET /api/admin/reports
exports.getReports = async (req, res) => {
    const reports = await reportService.getAllReports();
    return success(res, reports);
};


// POST /api/admin/reports/:reportId/action
exports.handleReportAction = async (req, res) => {
    const { reportId } = req.params;
    const { action } = req.body;

    const report = await reportService.updateReportStatus(reportId, action === 'resolve' ? 'resolved' : 'reviewed');

    let message;
    if (action === 'delete_video' && report.videoId) {
        await reportService.deleteVideoAndReports(report.videoId);
        message = 'Vídeo excluído e denúncias resolvidas.';
    } else {
        message = `Denúncia ${reportId} ${action === 'resolve' ? 'resolvida' : 'revisada'}.`;
    }

    return success(res, null, message);
};


// GET /api/admin/users
exports.getUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    return success(res, users);
};


// POST /api/admin/users/:userId/toggle-block
exports.toggleUserBlock = async (req, res) => {
    const { userId } = req.params;
    const user = await userService.toggleUserBlockStatus(userId);
    return success(
        res,
        { id: user.id, isBlocked: user.isBlocked },
        `Usuário ${user.username} ${user.isBlocked ? 'bloqueado' : 'desbloqueado'}.`
    );
};


// GET /api/admin/videos
exports.getVideos = async (req, res) => {
    const videos = await videoService.getAllVideosAdmin();
    return success(res, videos);
};


// DELETE /api/admin/videos/:videoId
exports.deleteVideoAdmin = async (req, res) => {
    const { videoId } = req.params;
    await reportService.deleteVideoAndReports(videoId); // reutiliza a função que exclui vídeo e denúncias
    return success(res, null, 'Vídeo excluído permanentemente.');
};
