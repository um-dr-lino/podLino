const { Op } = require('sequelize');

const Report = require('./reportModel');
const Video = require('../video/videoModel');
const User = require('../user/userModel');

const videoService = require("../video/videoService");


async function createReport(userId, videoId, reason) {
    const existingReport = await Report.findOne({ where: { userId, videoId } });
    if (existingReport) {
        throw new Error('Você já denunciou este vídeo.');
    }
    const report = await Report.create({ userId, videoId, reason });
    return report;
}


async function getAllReports() {
    const reports = await Report.findAll({
        include: [
            { model: User, attributes: ['id', 'username', 'fullName'] },
            { model: Video, attributes: ['id', 'title', 'thumbnailPath', 'userId'],
                include: [{ model: User, attributes: ['username'] }] // Incluir o autor do vídeo
            }
        ],
        order: [['createdAt', 'DESC']]
    });
    return reports;
}


async function updateReportStatus(reportId, status) {
    const report = await Report.findByPk(reportId);
    if (!report) {
        throw new Error('Denúncia não encontrada.');
    }
    report.status = status;
    await report.save();
    return report;
}


async function deleteVideoAndReports(videoId) {
    await videoService.deleteVideo(videoId, null, true); // true = ação administrativa
    await Report.destroy({ where: { videoId } }); // garante limpeza mesmo se já havia sido removida no deleteVideo
    return { message: "Vídeo e denúncias associadas excluídos com sucesso." };
}


module.exports = {
    createReport,
    getAllReports,
    updateReportStatus,
    deleteVideoAndReports
};